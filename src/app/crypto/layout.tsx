import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crypto',
  description: 'Live crypto prices, 14-day candlestick charts, and pattern detection.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
