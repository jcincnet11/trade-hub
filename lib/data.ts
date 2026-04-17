import type { OHLCCandle } from './types/market'

// Client-side OHLC fetchers. Both proxy through our own API routes so we
// get ISR caching + centralized logging + Zod validation at the boundary.

export type CryptoDays = 1 | 7 | 14 | 30 | 90 | 180 | 365
export type ForexDays = 7 | 14 | 30 | 90 | 180 | 365

export async function fetchCryptoOHLC(id: string, days: CryptoDays): Promise<OHLCCandle[]> {
  const res = await fetch(`/api/crypto/ohlc/${encodeURIComponent(id)}?days=${days}`)
  if (!res.ok) throw new Error(`crypto ohlc ${res.status}`)
  return res.json()
}

export async function fetchForexOHLC(pair: string, days: ForexDays): Promise<OHLCCandle[]> {
  // Accept either "EUR/USD" or "EUR-USD"; the route expects the hyphenated form.
  const slug = pair.replace('/', '-')
  const res = await fetch(`/api/forex/ohlc/${encodeURIComponent(slug)}?days=${days}`)
  if (!res.ok) throw new Error(`forex ohlc ${res.status}`)
  return res.json()
}
