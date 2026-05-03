'use client'
import useSWR from 'swr'
import { fetchCryptoOHLC, fetchForexOHLC } from '@/lib/data'

interface SparklineProps {
  id: string
  market: 'crypto' | 'forex'
  width?: number
  height?: number
}

export function Sparkline({ id, market, width = 80, height = 30 }: SparklineProps) {
  const key = `spark-${market}-${id}`
  const { data } = useSWR(
    key,
    () => (market === 'crypto' ? fetchCryptoOHLC(id, 7) : fetchForexOHLC(id, 30)),
    { refreshInterval: 60_000, revalidateOnFocus: false },
  )

  if (!data || data.length < 2) {
    return <div style={{ width, height, opacity: 0.25 }} />
  }

  const closes = data.map((c) => c.close)
  const min = Math.min(...closes)
  const max = Math.max(...closes)
  const span = max - min || 1
  const step = width / (closes.length - 1)
  const points = closes
    .map((v, i) => `${(i * step).toFixed(2)},${(height - ((v - min) / span) * height).toFixed(2)}`)
    .join(' ')
  const up = closes[closes.length - 1] >= closes[0]
  const color = up ? 'var(--green)' : 'var(--red)'

  return (
    <svg width={width} height={height} style={{ display: 'block' }} aria-hidden="true">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  )
}
