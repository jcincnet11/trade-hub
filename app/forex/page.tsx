'use client'
import { useState } from 'react'
import { useForexRates } from '@/lib/hooks/useMarketData'
import { useWatchlist } from '@/lib/hooks/useWatchlist'
import { PairCard } from '@/components/market/PairCard'
import { MarketItem } from '@/lib/types/market'

export default function ForexPage() {
  const { rates, isLoading, error } = useForexRates()
  const { toggle, isWatched } = useWatchlist()
  const [selected, setSelected] = useState<string | null>(null)

  const items: MarketItem[] = rates.map((r) => ({ ...r, patterns: [], type: 'forex' }))

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Forex</h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Live rates · auto-refresh 1h</p>
      </div>

      {error && (
        <div style={{
          background: 'var(--bg-card)', border: '0.5px solid var(--red)', borderRadius: '7px',
          padding: '10px 12px', marginBottom: '12px', color: 'var(--red)', fontSize: '12px',
        }}>
          Couldn&apos;t reach the ExchangeRate API proxy. Retrying automatically.
        </div>
      )}

      {isLoading && rates.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '10px', height: '96px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {items.map((item) => (
            <PairCard
              key={item.id}
              item={item}
              selected={selected === item.id}
              watched={isWatched(item.id)}
              onSelect={() => setSelected(selected === item.id ? null : item.id)}
              onWatch={() => toggle(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
