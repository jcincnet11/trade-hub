import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forex',
  description: 'Live forex pair rates.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
