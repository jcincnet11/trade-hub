'use client'
import useSWR from 'swr'
import { OHLCCandle } from '../types/market'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const COIN_MAP: Record<string, { name: string; symbol: string }> = {
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

type CoinGeckoRow = {
  usd?: number
  usd_24h_change?: number
  usd_24h_vol?: number
  usd_market_cap?: number
}

export function useCryptoPrices() {
  const { data, error, isLoading, mutate } = useSWR<Record<string, CoinGeckoRow>>(
    '/api/crypto/prices',
    fetcher,
    { refreshInterval: 60000 }
  )

  const prices = data
    ? Object.entries(COIN_MAP).map(([id, meta]) => ({
        id,
        symbol: meta.symbol,
        name: meta.name,
        price: data[id]?.usd ?? 0,
        change24h: data[id]?.usd_24h_change ?? 0,
        volume24h: data[id]?.usd_24h_vol ?? 0,
        marketCap: data[id]?.usd_market_cap ?? 0,
        type: 'crypto' as const,
      }))
    : []

  return { prices, error, isLoading, refresh: mutate }
}

export function useCryptoOHLC(id: string) {
  const { data, error, isLoading } = useSWR<OHLCCandle[]>(
    id ? `/api/crypto/ohlc/${id}` : null,
    fetcher,
    { refreshInterval: 300000 }
  )
  return { candles: data ?? [], error, isLoading }
}

export function useForexRates() {
  const { data, error, isLoading, mutate } = useSWR<Record<string, number>>(
    '/api/forex/rates',
    fetcher,
    { refreshInterval: 3600000 }
  )

  const PAIRS = [
    { symbol: 'EUR/USD', base: 'EUR', quote: 'USD', invert: true },
    { symbol: 'GBP/USD', base: 'GBP', quote: 'USD', invert: true },
    { symbol: 'USD/JPY', base: 'USD', quote: 'JPY', invert: false },
    { symbol: 'USD/CHF', base: 'USD', quote: 'CHF', invert: false },
    { symbol: 'AUD/USD', base: 'AUD', quote: 'USD', invert: true },
    { symbol: 'USD/CAD', base: 'USD', quote: 'CAD', invert: false },
    { symbol: 'NZD/USD', base: 'NZD', quote: 'USD', invert: true },
    { symbol: 'EUR/GBP', base: 'EUR', quote: 'GBP', invert: false },
  ]

  const rates = data
    ? PAIRS.map((pair) => {
        const rate = pair.invert
          ? 1 / (data[pair.base] ?? 1)
          : data[pair.quote] ?? 1
        return {
          id: pair.symbol.replace('/', '-'),
          symbol: pair.symbol,
          name: pair.symbol,
          price: rate,
          change24h: 0,
          type: 'forex' as const,
        }
      })
    : []

  return { rates, error, isLoading, refresh: mutate }
}
