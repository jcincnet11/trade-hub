import { OHLCCandle, PatternResult } from '../types/market'

const body = (c: OHLCCandle) => Math.abs(c.close - c.open)
const range = (c: OHLCCandle) => c.high - c.low
const upperShadow = (c: OHLCCandle) => c.high - Math.max(c.open, c.close)
const lowerShadow = (c: OHLCCandle) => Math.min(c.open, c.close) - c.low
const isBullish = (c: OHLCCandle) => c.close > c.open
const isBearish = (c: OHLCCandle) => c.close < c.open
const midpoint = (c: OHLCCandle) => (c.open + c.close) / 2

export function detectDoji(c: OHLCCandle): PatternResult | null {
  const bodyPct = range(c) > 0 ? body(c) / range(c) : 0
  if (bodyPct > 0.05) return null
  return {
    name: 'Doji',
    type: 'neutral',
    confidence: 70,
    description: 'Open and close are nearly equal — market indecision.',
    signal: 'Indecision — watch for confirmation',
  }
}

export function detectLongLeggedDoji(c: OHLCCandle): PatternResult | null {
  const bodyPct = range(c) > 0 ? body(c) / range(c) : 0
  if (bodyPct > 0.05) return null
  if (upperShadow(c) < range(c) * 0.3 || lowerShadow(c) < range(c) * 0.3) return null
  return {
    name: 'Long-legged Doji',
    type: 'neutral',
    confidence: 72,
    description: 'Large shadows both sides — extreme indecision.',
    signal: 'High volatility indecision',
  }
}

export function detectGravestoneDoji(c: OHLCCandle): PatternResult | null {
  const bodyPct = range(c) > 0 ? body(c) / range(c) : 0
  if (bodyPct > 0.05) return null
  if (upperShadow(c) < range(c) * 0.6) return null
  if (lowerShadow(c) > range(c) * 0.05) return null
  return {
    name: 'Gravestone Doji',
    type: 'bearish',
    confidence: 78,
    description: 'Price rallied then fell back — bears took control.',
    signal: 'Bearish reversal signal',
  }
}

export function detectDragonflyDoji(c: OHLCCandle): PatternResult | null {
  const bodyPct = range(c) > 0 ? body(c) / range(c) : 0
  if (bodyPct > 0.05) return null
  if (lowerShadow(c) < range(c) * 0.6) return null
  if (upperShadow(c) > range(c) * 0.05) return null
  return {
    name: 'Dragonfly Doji',
    type: 'bullish',
    confidence: 76,
    description: 'Price sold off then recovered — bulls stepped in.',
    signal: 'Bullish reversal signal',
  }
}

export function detectHammer(c: OHLCCandle, prev: OHLCCandle[]): PatternResult | null {
  const downtrend =
    prev.length >= 3 && prev.slice(-3).every((_p, i, a) => i === 0 || a[i].close < a[i - 1].close)
  if (!downtrend) return null
  if (body(c) === 0) return null
  if (lowerShadow(c) < body(c) * 2) return null
  if (upperShadow(c) > body(c) * 0.3) return null
  return {
    name: 'Hammer',
    type: 'bullish',
    confidence: 82,
    description: 'Strong lower shadow after downtrend — bulls defending.',
    signal: 'Potential bottom reversal',
  }
}

export function detectHangingMan(c: OHLCCandle, prev: OHLCCandle[]): PatternResult | null {
  const uptrend =
    prev.length >= 3 && prev.slice(-3).every((_p, i, a) => i === 0 || a[i].close > a[i - 1].close)
  if (!uptrend) return null
  if (body(c) === 0) return null
  if (lowerShadow(c) < body(c) * 2) return null
  if (upperShadow(c) > body(c) * 0.3) return null
  return {
    name: 'Hanging Man',
    type: 'bearish',
    confidence: 78,
    description: 'Hammer shape after uptrend — distribution signal.',
    signal: 'Potential top reversal',
  }
}

export function detectInvertedHammer(c: OHLCCandle, prev: OHLCCandle[]): PatternResult | null {
  const downtrend =
    prev.length >= 3 && prev.slice(-3).every((_p, i, a) => i === 0 || a[i].close < a[i - 1].close)
  if (!downtrend) return null
  if (body(c) === 0) return null
  if (upperShadow(c) < body(c) * 2) return null
  if (lowerShadow(c) > body(c) * 0.3) return null
  return {
    name: 'Inverted Hammer',
    type: 'bullish',
    confidence: 72,
    description: 'Bulls attempted rally after downtrend — needs confirmation.',
    signal: 'Possible reversal — confirm next candle',
  }
}

export function detectShootingStar(c: OHLCCandle, prev: OHLCCandle[]): PatternResult | null {
  const uptrend =
    prev.length >= 3 && prev.slice(-3).every((_p, i, a) => i === 0 || a[i].close > a[i - 1].close)
  if (!uptrend) return null
  if (body(c) === 0) return null
  if (upperShadow(c) < body(c) * 2) return null
  if (lowerShadow(c) > body(c) * 0.3) return null
  return {
    name: 'Shooting Star',
    type: 'bearish',
    confidence: 80,
    description: 'Price shot up then rejected — bears took control.',
    signal: 'Bearish reversal at resistance',
  }
}

export function detectMarubozu(c: OHLCCandle): PatternResult | null {
  if (range(c) === 0) return null
  if (upperShadow(c) > range(c) * 0.02 || lowerShadow(c) > range(c) * 0.02) return null
  const type = isBullish(c) ? 'bullish' : 'bearish'
  return {
    name: `${isBullish(c) ? 'Bullish' : 'Bearish'} Marubozu`,
    type,
    confidence: 85,
    description: `Full-body candle with no shadows — strong ${type} conviction.`,
    signal: `Strong ${type} momentum — likely continuation`,
  }
}

export function detectSpinningTop(c: OHLCCandle): PatternResult | null {
  const bodyPct = range(c) > 0 ? body(c) / range(c) : 0
  if (bodyPct < 0.05 || bodyPct > 0.35) return null
  if (upperShadow(c) < body(c) || lowerShadow(c) < body(c)) return null
  return {
    name: 'Spinning Top',
    type: 'neutral',
    confidence: 65,
    description: 'Small body with equal shadows — indecision.',
    signal: 'Market consolidating',
  }
}

export function detectBullishEngulfing(c: OHLCCandle, prev: OHLCCandle): PatternResult | null {
  if (!isBearish(prev) || !isBullish(c)) return null
  if (c.open >= prev.close || c.close <= prev.open) return null
  return {
    name: 'Bullish Engulfing',
    type: 'bullish',
    confidence: 85,
    description: 'Bulls completely engulfed prior bearish candle.',
    signal: 'Strong bullish reversal',
  }
}

export function detectBearishEngulfing(c: OHLCCandle, prev: OHLCCandle): PatternResult | null {
  if (!isBullish(prev) || !isBearish(c)) return null
  if (c.open <= prev.close || c.close >= prev.open) return null
  return {
    name: 'Bearish Engulfing',
    type: 'bearish',
    confidence: 85,
    description: 'Bears completely engulfed prior bullish candle.',
    signal: 'Strong bearish reversal',
  }
}

export function detectBullishHarami(c: OHLCCandle, prev: OHLCCandle): PatternResult | null {
  if (!isBearish(prev) || !isBullish(c)) return null
  if (c.open <= prev.close || c.close >= prev.open) return null
  if (body(c) >= body(prev)) return null
  return {
    name: 'Bullish Harami',
    type: 'bullish',
    confidence: 68,
    description: 'Small bullish candle inside prior bearish body.',
    signal: 'Potential reversal — needs confirmation',
  }
}

export function detectBearishHarami(c: OHLCCandle, prev: OHLCCandle): PatternResult | null {
  if (!isBullish(prev) || !isBearish(c)) return null
  if (c.open >= prev.close || c.close <= prev.open) return null
  if (body(c) >= body(prev)) return null
  return {
    name: 'Bearish Harami',
    type: 'bearish',
    confidence: 68,
    description: 'Small bearish candle inside prior bullish body.',
    signal: 'Potential reversal — needs confirmation',
  }
}

export function detectPiercingLine(c: OHLCCandle, prev: OHLCCandle): PatternResult | null {
  if (!isBearish(prev) || !isBullish(c)) return null
  if (c.open >= prev.close) return null
  if (c.close <= midpoint(prev) || c.close >= prev.open) return null
  return {
    name: 'Piercing Line',
    type: 'bullish',
    confidence: 75,
    description: 'Bulls pierced above midpoint of prior bearish candle.',
    signal: 'Bullish reversal signal',
  }
}

export function detectDarkCloudCover(c: OHLCCandle, prev: OHLCCandle): PatternResult | null {
  if (!isBullish(prev) || !isBearish(c)) return null
  if (c.open <= prev.close) return null
  if (c.close >= midpoint(prev) || c.close <= prev.open) return null
  return {
    name: 'Dark Cloud Cover',
    type: 'bearish',
    confidence: 75,
    description: 'Bears pierced below midpoint of prior bullish candle.',
    signal: 'Bearish reversal signal',
  }
}

export function detectTweezers(c: OHLCCandle, prev: OHLCCandle): PatternResult | null {
  const tolerance = ((c.high + prev.high) / 2) * 0.001
  if (Math.abs(c.high - prev.high) < tolerance && isBearish(c) && isBullish(prev)) {
    return {
      name: 'Tweezer Top',
      type: 'bearish',
      confidence: 70,
      description: 'Two candles with matching highs — resistance confirmed.',
      signal: 'Bearish reversal at resistance',
    }
  }
  if (Math.abs(c.low - prev.low) < tolerance && isBullish(c) && isBearish(prev)) {
    return {
      name: 'Tweezer Bottom',
      type: 'bullish',
      confidence: 70,
      description: 'Two candles with matching lows — support confirmed.',
      signal: 'Bullish reversal at support',
    }
  }
  return null
}

export function detectMorningStar(
  c: OHLCCandle,
  mid: OHLCCandle,
  prev: OHLCCandle,
): PatternResult | null {
  if (!isBearish(prev)) return null
  if (body(mid) > body(prev) * 0.3) return null
  if (!isBullish(c)) return null
  if (c.close < midpoint(prev)) return null
  return {
    name: 'Morning Star',
    type: 'bullish',
    confidence: 88,
    description: 'Three-candle bullish reversal after downtrend.',
    signal: 'Strong bullish reversal',
  }
}

export function detectEveningStar(
  c: OHLCCandle,
  mid: OHLCCandle,
  prev: OHLCCandle,
): PatternResult | null {
  if (!isBullish(prev)) return null
  if (body(mid) > body(prev) * 0.3) return null
  if (!isBearish(c)) return null
  if (c.close > midpoint(prev)) return null
  return {
    name: 'Evening Star',
    type: 'bearish',
    confidence: 88,
    description: 'Three-candle bearish reversal after uptrend.',
    signal: 'Strong bearish reversal',
  }
}

export function detectThreeWhiteSoldiers(
  c: OHLCCandle,
  mid: OHLCCandle,
  prev: OHLCCandle,
): PatternResult | null {
  if (!isBullish(prev) || !isBullish(mid) || !isBullish(c)) return null
  if (mid.close <= prev.close || c.close <= mid.close) return null
  if (mid.open <= prev.open || c.open <= mid.open) return null
  return {
    name: 'Three White Soldiers',
    type: 'bullish',
    confidence: 90,
    description: 'Three consecutive bullish candles — strong upward momentum.',
    signal: 'Strong bullish continuation',
  }
}

export function detectThreeBlackCrows(
  c: OHLCCandle,
  mid: OHLCCandle,
  prev: OHLCCandle,
): PatternResult | null {
  if (!isBearish(prev) || !isBearish(mid) || !isBearish(c)) return null
  if (mid.close >= prev.close || c.close >= mid.close) return null
  if (mid.open >= prev.open || c.open >= mid.open) return null
  return {
    name: 'Three Black Crows',
    type: 'bearish',
    confidence: 90,
    description: 'Three consecutive bearish candles — strong downward momentum.',
    signal: 'Strong bearish continuation',
  }
}
