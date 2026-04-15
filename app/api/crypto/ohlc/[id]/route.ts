import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=14`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error('CoinGecko OHLC error')
    const data = (await res.json()) as number[][]
    const candles = data.map((c) => ({
      time: Math.floor(c[0] / 1000),
      open: c[1],
      high: c[2],
      low: c[3],
      close: c[4],
    }))
    return NextResponse.json(candles)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch OHLC' }, { status: 500 })
  }
}
