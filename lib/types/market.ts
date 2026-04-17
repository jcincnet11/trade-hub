export interface OHLCCandle {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface PriceData {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  image?: string
}

export interface ForexRate {
  symbol: string
  base: string
  quote: string
  rate: number
  change24h: number
}

export interface PatternResult {
  name: string
  type: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  description: string
  signal: string
}

// Series-variant match — one per pattern occurrence along a candle series.
// Used by chart markers on detail pages.
export interface PatternHit {
  name: string
  type: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  index: number
  time: number
}

export interface MarketItem {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h?: number
  marketCap?: number
  patterns: PatternResult[]
  candles?: OHLCCandle[]
  type: 'crypto' | 'forex'
}
