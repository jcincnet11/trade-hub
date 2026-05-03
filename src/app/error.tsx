'use client'
import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('app/error boundary', error)
  }, [error])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <AlertTriangle size={32} color="var(--red)" />
      <h1 style={{ fontSize: '18px', fontWeight: 600, marginTop: '16px' }}>Something went wrong</h1>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginTop: '6px',
          maxWidth: '420px',
        }}
      >
        {error.message || 'An unexpected error occurred while rendering this page.'}
      </p>
      {error.digest && (
        <p
          style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            marginTop: '4px',
            fontFamily: 'monospace',
          }}
        >
          digest: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{
          marginTop: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--indigo)',
          border: 'none',
          borderRadius: '7px',
          padding: '8px 14px',
          cursor: 'pointer',
          color: 'white',
          fontSize: '12px',
          fontWeight: 500,
        }}
      >
        <RotateCcw size={13} /> Try again
      </button>
    </div>
  )
}
