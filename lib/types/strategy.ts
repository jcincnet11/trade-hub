export type SignalType = 'bullish-reversal' | 'bearish-reversal' | 'continuation' | 'breakout' | 'scalp'
export type MarketType = 'crypto' | 'forex' | 'both'

export interface Strategy {
  id: string
  name: string
  description: string
  signalType: SignalType
  marketType: MarketType
  patterns: string[]
  entryRules: string
  exitRules: string
  notes: string
  createdAt: string
  updatedAt: string
}
