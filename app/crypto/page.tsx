'use client'
import { useState } from 'react'
import { useCryptoPrices, useCryptoOHLC } from '@/lib/hooks/useMarketData'
import { useWatchlist } from '@/lib/hooks/useWatchlist'
import { detectPatterns } from '@/lib/patterns/detector'
import { PairCard } from '@/components/market/PairCard'
import { PriceChart } from '@/components/market/PriceChart'
import { PatternBadge } from '@/components/market/PatternBadge'
import { formatPrice, formatChange, formatVolume, formatMarketCap, changeColor } from '@/lib/utils/formatters'
import { MarketItem } from '@/lib/types/market'
import { RefreshCw } from 'lucide-react'

function DetailPanel({ item, onClose }: { item: MarketItem; onClose: () => void }) {
  const { candles } = useCryptoOHLC(item.id)
  const patterns = candles.length ? detectPatterns(candles) : item.patterns

  return (
    <div style={{
      background: 'var(--bg-card)', border: '0.5px solid var(--border)',
      borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>{item.name}</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.symbol} · Crypto</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '18px' }}>×</button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Price</p>
          <p style={{ fontSize: '24px', fontWeight: 700 }}>{formatPrice(item.price)}</p>
        </div>
        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>24h change</p>
          <p style={{ fontSize: '18px', fontWeight: 600, color: changeColor(item.change24h) }}>{formatChange(item.change24h)}</p>
        </div>
        {item.volume24h !== undefined && <div><p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Volume</p><p style={{ fontSize: '14px', fontWeight: 500 }}>{formatVolume(item.volume24h)}</p></div>}
        {item.marketCap !== undefined && <div><p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Market cap</p><p style={{ fontSize: '14px', fontWeight: 500 }}>{formatMarketCap(item.marketCap)}</p></div>}
      </div>

      {candles.length > 0 && <div style={{ marginBottom: '1rem' }}><PriceChart candles={candles} /></div>}

      {patterns.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detected patterns</p>
          {patterns.map((p, i) => <PatternBadge key={i} pattern={p} />)}
        </div>
      )}
    </div>
  )
}

export default function CryptoPage() {
  const { prices, isLoading, refresh } = useCryptoPrices()
  const { toggle, isWatched } = useWatchlist()
  const [selected, setSelected] = useState<string | null>(null)

  const items: MarketItem[] = prices.map((p) => ({
    ...p,
    patterns: [],
    type: 'crypto',
  }))

  const selectedItem = items.find((i) => i.id === selected)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Crypto</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Live prices · auto-refresh 60s</p>
        </div>
        <button onClick={() => refresh()} style={{
          background: 'none', border: '0.5px solid var(--border)', borderRadius: '7px',
          padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px',
        }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {selectedItem && <DetailPanel item={selectedItem} onClose={() => setSelected(null)} />}

      {isLoading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading prices...</p>
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
