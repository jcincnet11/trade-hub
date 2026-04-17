import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { ohlcResponseSchema } from '@/lib/schemas'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=14`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error(`CoinGecko OHLC ${res.status}`)
    const raw = await res.json()
    const parsed = ohlcResponseSchema.safeParse(raw)
    if (!parsed.success) {
      logger.error({ id, issues: parsed.error.issues }, '[api/crypto/ohlc] schema mismatch')
      return NextResponse.json({ error: 'Invalid upstream response' }, { status: 502 })
    }
    const candles = parsed.data.map((c) => ({
      time: Math.floor(c[0] / 1000),
      open: c[1],
      high: c[2],
      low: c[3],
      close: c[4],
    }))
    return NextResponse.json(candles)
  } catch (err) {
    logger.error({ id, err }, '[api/crypto/ohlc] fetch failed')
    return NextResponse.json({ error: 'Failed to fetch OHLC' }, { status: 500 })
  }
}
