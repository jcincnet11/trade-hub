const cardStyle = {
  background: 'var(--bg-card)',
  border: '0.5px solid var(--border)',
  borderRadius: '10px',
  padding: '18px',
  height: '160px',
}

export default function Loading() {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Strategies</h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Loading scanner + playbook…</p>
      </div>
      <div style={{ display: 'grid', gap: '12px' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={cardStyle} />
        ))}
      </div>
    </div>
  )
}
