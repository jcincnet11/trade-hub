'use client'
import { MarketItem } from '@/lib/types/market'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { formatPrice, formatChange, changeColor } from '@/lib/utils/formatters'
import { Star } from 'lucide-react'

interface PairCardProps {
  item: MarketItem
  selected?: boolean
  watched?: boolean
  onSelect: () => void
  onWatch: () => void
}

export function PairCard({ item, selected, watched, onSelect, onWatch }: PairCardProps) {
  const topPattern = item.patterns[0]

  return (
    <Card onClick={onSelect} selected={selected}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.symbol}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onWatch() }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}
            >
              <Star
                size={12}
                fill={watched ? 'var(--amber)' : 'none'}
                stroke={watched ? 'var(--amber)' : 'var(--text-muted)'}
              />
            </button>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.name}</span>
        </div>
        {topPattern && <Badge type={topPattern.type} size="sm" label={topPattern.type === 'bullish' ? 'Bull' : topPattern.type === 'bearish' ? 'Bear' : 'Neutral'} />}
      </div>
      <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
        {formatPrice(item.price)}
      </div>
      <div style={{ fontSize: '12px', color: changeColor(item.change24h), fontWeight: 500 }}>
        {formatChange(item.change24h)} 24h
      </div>
      {topPattern && (
        <div style={{
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '0.5px solid var(--border)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
        }}>
          {topPattern.name}
        </div>
      )}
    </Card>
  )
}
