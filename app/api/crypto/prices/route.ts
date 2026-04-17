import { NextResponse } from 'next/server'

const COINS = 'bitcoin,ethereum,solana,ripple,binancecoin,cardano,avalanche-2,dogecoin,polkadot,matic-network'

export async function GET() {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${COINS}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[api/crypto/prices]', err)
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}
