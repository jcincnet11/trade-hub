export default function Loading() {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Watchlist</h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Loading…</p>
      </div>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '0.5px solid var(--border)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: '58px',
              borderBottom: i < 4 ? '0.5px solid var(--border)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}
