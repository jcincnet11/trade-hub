import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Watchlist',
  description: 'The pairs you’re watching across crypto and forex.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
