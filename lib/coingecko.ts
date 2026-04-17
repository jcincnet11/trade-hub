import { OHLCCandle } from './types/market'
import { logger } from './logger'
import { ohlcResponseSchema, marketChartResponseSchema } from './schemas'

export interface CoinMeta {
  name: string
  symbol: string
}

export const COIN_MAP: Record<string, CoinMeta> = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC' },
  ethereum: { name: 'Ethereum', symbol: 'ETH' },
  solana: { name: 'Solana', symbol: 'SOL' },
  ripple: { name: 'XRP', symbol: 'XRP' },
  binancecoin: { name: 'BNB', symbol: 'BNB' },
  cardano: { name: 'Cardano', symbol: 'ADA' },
  'avalanche-2': { name: 'Avalanche', symbol: 'AVAX' },
  dogecoin: { name: 'Dogecoin', symbol: 'DOGE' },
  polkadot: { name: 'Polkadot', symbol: 'DOT' },
  'matic-network': { name: 'Polygon', symbol: 'MATIC' },
}

export type Timeframe = '30min' | '4H' | '1D'

// CoinGecko /ohlc granularity is locked to the `days` param:
//   days=1       → 30-minute candles (~48)
//   days=2..30   → 4-hour candles
//   days=31+     → daily candles
const TF_DAYS: Record<Timeframe, number> = {
  '30min': 1,
  '4H': 30,
  '1D': 180,
}

// Higher-TF context per entry TF (~4× the entry granularity).
const HIGHER_TF_DAYS: Record<Timeframe, number> = {
  '30min': 30, // 4H context
  '4H': 180, // 1D context
  '1D': 365, // deeper 1D history (no weekly endpoint on free tier)
}

export function daysForTimeframe(tf: Timeframe): number {
  return TF_DAYS[tf]
}

export function daysForHigherTimeframe(tf: Timeframe): number {
  return HIGHER_TF_DAYS[tf]
}

export async function fetchOHLC(id: string, days: number): Promise<OHLCCandle[] | null> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${days}`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) {
      logger.error({ id, status: res.status }, '[coingecko.fetchOHLC] http error')
      return null
    }
    const raw = await res.json()
    const parsed = ohlcResponseSchema.safeParse(raw)
    if (!parsed.success) {
      logger.error({ id, issues: parsed.error.issues }, '[coingecko.fetchOHLC] schema mismatch')
      return null
    }
    return parsed.data.map((c) => ({
      time: Math.floor(c[0] / 1000),
      open: c[1],
      high: c[2],
      low: c[3],
      close: c[4],
    }))
  } catch (err) {
    logger.error({ id, err }, '[coingecko.fetchOHLC] fetch failed')
    return null
  }
}

export interface VolumePoint {
  time: number
  volume: number
}

export async function fetchVolumes(id: string, days: number): Promise<VolumePoint[] | null> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) {
      logger.error({ id, status: res.status }, '[coingecko.fetchVolumes] http error')
      return null
    }
    const raw = await res.json()
    const parsed = marketChartResponseSchema.safeParse(raw)
    if (!parsed.success) {
      logger.error({ id, issues: parsed.error.issues }, '[coingecko.fetchVolumes] schema mismatch')
      return null
    }
    return parsed.data.total_volumes.map(([t, v]) => ({ time: Math.floor(t / 1000), volume: v }))
  } catch (err) {
    logger.error({ id, err }, '[coingecko.fetchVolumes] fetch failed')
    return null
  }
}
