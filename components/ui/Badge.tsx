interface BadgeProps {
  type: 'bullish' | 'bearish' | 'neutral'
  label?: string
  size?: 'sm' | 'md'
}

const styles = {
  bullish: { bg: 'var(--green-dim)', color: 'var(--green)', border: 'var(--green)' },
  bearish: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'var(--red)' },
  neutral: { bg: 'var(--amber-dim)', color: 'var(--amber)', border: 'var(--amber)' },
}

const icons = { bullish: '▲', bearish: '▼', neutral: '—' }
const labels = { bullish: 'Bullish', bearish: 'Bearish', neutral: 'Neutral' }

export function Badge({ type, label, size = 'md' }: BadgeProps) {
  const s = styles[type]
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      border: `0.5px solid ${s.border}30`,
      borderRadius: '4px',
      padding: size === 'sm' ? '1px 5px' : '2px 7px',
      fontSize: size === 'sm' ? '10px' : '11px',
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px',
    }}>
      {icons[type]} {label ?? labels[type]}
    </span>
  )
}
