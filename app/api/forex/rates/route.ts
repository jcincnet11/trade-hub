import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) throw new Error('ExchangeRate error')
    const data = await res.json()
    return NextResponse.json(data.rates)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch forex' }, { status: 500 })
  }
}
