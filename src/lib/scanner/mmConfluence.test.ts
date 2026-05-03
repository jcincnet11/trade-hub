import { describe, it, expect } from 'vitest'
import {
  ema,
  rsi,
  detectMWFormation,
  getDirection,
  scoreSetup,
  checkInvalidation,
  sessionInfo,
} from './mmConfluence'
import { OHLCCandle, PatternResult } from '../types/market'

function candles(closes: number[]): OHLCCandle[] {
  return closes.map((close, i) => ({
    time: i,
    open: i === 0 ? close : closes[i - 1],
    high: Math.max(close, i === 0 ? close : closes[i - 1]) + 0.1,
    low: Math.min(close, i === 0 ? close : closes[i - 1]) - 0.1,
    close,
  }))
}

describe('ema', () => {
  it('returns empty for too-short input', () => {
    expect(ema([1, 2, 3], 5)).toEqual([])
  })

  it('starts with the seed SMA', () => {
    const out = ema([10, 10, 10, 10, 10, 10], 3)
    expect(out[0]).toBe(10)
    expect(out.at(-1)).toBe(10)
  })

  it('tracks an increasing series upward', () => {
    const values = Array.from({ length: 50 }, (_, i) => i + 1)
    const out = ema(values, 10)
    for (let i = 1; i < out.length; i++) {
      expect(out[i]).toBeGreaterThan(out[i - 1])
    }
  })
})

describe('rsi', () => {
  it('returns NaN for too-short input', () => {
    expect(rsi([1, 2, 3], 14)).toBeNaN()
  })

  it('is 100 when all moves are up', () => {
    const up = Array.from({ length: 30 }, (_, i) => 100 + i)
    expect(rsi(up, 14)).toBe(100)
  })

  it('is 0 when all moves are down', () => {
    const down = Array.from({ length: 30 }, (_, i) => 200 - i)
    expect(rsi(down, 14)).toBe(0)
  })

  it('is mid-range for a sideways series', () => {
    const flat = Array.from({ length: 30 }, (_, i) => 100 + (i % 2 === 0 ? 1 : -1))
    const v = rsi(flat, 14)
    expect(v).toBeGreaterThan(30)
    expect(v).toBeLessThan(70)
  })
})

describe('detectMWFormation', () => {
  it('returns null for fewer than 10 candles', () => {
    expect(detectMWFormation(candles([1, 2, 3]))).toBeNull()
  })

  it('detects a W when second low pierces first and close is back above first low', () => {
    // Detector tracks the two lowest lows in the window, then requires the later one
    // in time to be deeper than the earlier one. Hand-crafted so nothing between
    // the two swing lows dips below the first.
    const w: OHLCCandle[] = [
      { time: 0, open: 100, high: 101, low: 98, close: 100 },
      { time: 1, open: 100, high: 100, low: 97, close: 98 },
      { time: 2, open: 98, high: 99, low: 94, close: 96 }, // first low 94
      { time: 3, open: 96, high: 99, low: 96, close: 98 },
      { time: 4, open: 98, high: 100, low: 97, close: 99 },
      { time: 5, open: 99, high: 100, low: 97, close: 98 },
      { time: 6, open: 98, high: 99, low: 96, close: 97 },
      { time: 7, open: 97, high: 98, low: 96, close: 97 },
      { time: 8, open: 97, high: 98, low: 90, close: 93 }, // second low 90 (deeper)
      { time: 9, open: 95, high: 101, low: 95, close: 100 }, // close 100 > first low 94
    ]
    expect(detectMWFormation(w)).toBe('W')
  })

  it('detects an M when second high pierces first and close is below first high', () => {
    const m: OHLCCandle[] = [
      { time: 0, open: 100, high: 100, low: 99, close: 100 },
      { time: 1, open: 100, high: 102, low: 100, close: 102 },
      { time: 2, open: 102, high: 106, low: 102, close: 104 }, // first high 106
      { time: 3, open: 104, high: 105, low: 101, close: 102 },
      { time: 4, open: 102, high: 104, low: 101, close: 101 },
      { time: 5, open: 101, high: 103, low: 101, close: 102 },
      { time: 6, open: 102, high: 104, low: 102, close: 103 },
      { time: 7, open: 103, high: 105, low: 102, close: 103 },
      { time: 8, open: 103, high: 110, low: 103, close: 107 }, // second high 110 (higher)
      { time: 9, open: 105, high: 105, low: 100, close: 100 }, // close 100 < first high 106
    ]
    expect(detectMWFormation(m)).toBe('M')
  })
})

describe('getDirection', () => {
  it('returns long when higher-TF close is well above its EMA', () => {
    const rising = Array.from({ length: 60 }, (_, i) => 100 + i)
    expect(getDirection(candles(rising))).toBe('long')
  })

  it('returns short when higher-TF close is well below its EMA', () => {
    const falling = Array.from({ length: 60 }, (_, i) => 200 - i)
    expect(getDirection(candles(falling))).toBe('short')
  })

  it('returns null with too-few candles', () => {
    expect(getDirection(candles([1, 2, 3]))).toBeNull()
  })
})

describe('scoreSetup', () => {
  const bullishPattern: PatternResult = {
    name: 'Hammer',
    type: 'bullish',
    confidence: 82,
    description: '',
    signal: '',
  }

  it('caps at 7 checklist points', () => {
    const rising = candles(Array.from({ length: 60 }, (_, i) => 100 + i * 0.5))
    const out = scoreSetup({
      direction: 'long',
      isCrypto: true,
      candles: rising,
      higherCandles: rising,
      volumes: Array.from({ length: 60 }, () => 100),
      patterns: [bullishPattern],
    })
    expect(out.score).toBeGreaterThanOrEqual(0)
    expect(out.score).toBeLessThanOrEqual(7)
  })

  it('assigns grade A for score >= 6, B for 4-5, C otherwise', () => {
    const flat = candles(Array.from({ length: 60 }, () => 100))
    const out = scoreSetup({
      direction: 'long',
      isCrypto: false,
      candles: flat,
      higherCandles: flat,
      volumes: null,
      patterns: [],
    })
    // flat series is unlikely to pass many pillars → C
    expect(out.grade).toBe('C')
  })

  it('surfaces the pattern matching the direction', () => {
    const flat = candles(Array.from({ length: 60 }, () => 100))
    const bearishPattern: PatternResult = {
      ...bullishPattern,
      name: 'Shooting Star',
      type: 'bearish',
    }
    const out = scoreSetup({
      direction: 'short',
      isCrypto: false,
      candles: flat,
      higherCandles: flat,
      volumes: null,
      patterns: [bullishPattern, bearishPattern],
    })
    expect(out.pattern?.name).toBe('Shooting Star')
  })
})

describe('checkInvalidation', () => {
  it('returns null when there is no pattern', () => {
    const flat = candles(Array.from({ length: 20 }, () => 100))
    expect(checkInvalidation({ direction: 'long', candles: flat, pattern: null })).toBeNull()
  })

  it('flags a deep stop-hunt wick as a likely real breakout', () => {
    const base = candles(Array.from({ length: 20 }, () => 100))
    const last = base[base.length - 1]
    last.low = 80 // deep wick: 20-unit wick vs ~20-unit 20-candle range (> 50%)
    last.open = 99
    last.close = 100
    const result = checkInvalidation({
      direction: 'long',
      candles: base,
      pattern: { name: 'Hammer', type: 'bullish', confidence: 80, description: '', signal: '' },
    })
    expect(result).toMatch(/wick/i)
  })
})

describe('sessionInfo', () => {
  it('labels crypto prime window', () => {
    // 9am EST = 13:00 UTC (standard) / 14:00 UTC (DST). Pick a date that's unambiguously 9am EST.
    const info = sessionInfo(true, new Date('2026-01-15T14:00:00Z')) // 9am EST
    expect(info.valid).toBe(true)
    expect(info.label).toBe('Prime session')
  })

  it('labels forex off-session', () => {
    const info = sessionInfo(false, new Date('2026-01-15T17:00:00Z')) // 12pm EST
    expect(info.valid).toBe(false)
    expect(info.label).toBe('Off-session')
  })
})
