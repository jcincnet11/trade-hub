import { z } from 'zod'

// CoinGecko /simple/price?include_24hr_change=true&include_24hr_vol=true&include_market_cap=true
export const cryptoPricesResponseSchema = z.record(
  z.string(),
  z.object({
    usd: z.number().optional(),
    usd_24h_change: z.number().optional(),
    usd_24h_vol: z.number().optional(),
    usd_market_cap: z.number().optional(),
  })
)
export type CryptoPricesResponse = z.infer<typeof cryptoPricesResponseSchema>

// CoinGecko /coins/{id}/ohlc — array of [time, open, high, low, close] tuples.
export const ohlcRowSchema = z.tuple([z.number(), z.number(), z.number(), z.number(), z.number()])
export const ohlcResponseSchema = z.array(ohlcRowSchema)
export type OHLCResponse = z.infer<typeof ohlcResponseSchema>

// CoinGecko /coins/{id}/market_chart — only `total_volumes` is used.
export const marketChartResponseSchema = z.object({
  total_volumes: z.array(z.tuple([z.number(), z.number()])),
})
export type MarketChartResponse = z.infer<typeof marketChartResponseSchema>

// ExchangeRate API /latest/USD
export const forexRatesResponseSchema = z.object({
  rates: z.record(z.string(), z.number()),
})
export type ForexRatesResponse = z.infer<typeof forexRatesResponseSchema>
