export function Card({ children, onClick, selected }: {
  children: React.ReactNode
  onClick?: () => void
  selected?: boolean
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: `0.5px solid ${selected ? 'var(--indigo)' : 'var(--border)'}`,
        borderRadius: '10px',
        padding: '14px 16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => !selected && ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-hover)')}
      onMouseLeave={(e) => !selected && ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')}
    >
      {children}
    </div>
  )
}
