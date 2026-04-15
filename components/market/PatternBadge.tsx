import { PatternResult } from '@/lib/types/market'
import { Badge } from '../ui/Badge'

export function PatternBadge({ pattern }: { pattern: PatternResult }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 10px',
      background: 'var(--bg-secondary)',
      borderRadius: '6px',
      marginBottom: '4px',
    }}>
      <div>
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{pattern.name}</span>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>{pattern.signal}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Badge type={pattern.type} size="sm" />
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{pattern.confidence}%</span>
      </div>
    </div>
  )
}
