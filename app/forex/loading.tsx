const skeletonStyle = {
  background: 'var(--bg-card)',
  border: '0.5px solid var(--border)',
  borderRadius: '10px',
  padding: '18px',
  height: '96px',
}

export default function Loading() {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Forex</h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Loading rates…</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={skeletonStyle} />
        ))}
      </div>
    </div>
  )
}
