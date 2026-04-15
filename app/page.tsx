'use client'
import { useCryptoPrices, useForexRates } from '@/lib/hooks/useMarketData'
import { useStrategies } from '@/lib/hooks/useStrategies'
import { formatChange, changeColor } from '@/lib/utils/formatters'
import Link from 'next/link'
import { ArrowUpRight, RefreshCw } from 'lucide-react'

export default function Dashboard() {
  const { prices, isLoading: cLoading, refresh: refreshC } = useCryptoPrices()
  const { rates } = useForexRates()
  const { strategies } = useStrategies()

  const allMarkets = [...prices, ...rates]
  const bullish = allMarkets.filter((m) => m.change24h > 1).length
  const bearish = allMarkets.filter((m) => m.change24h < -1).length
  const topGainers = [...prices].sort((a, b) => b.change24h - a.change24h).slice(0, 5)
  const topLosers = [...prices].sort((a, b) => a.change24h - b.change24h).slice(0, 5)

  const metrics = [
    { label: 'Tracked pairs', value: allMarkets.length.toString() },
    { label: 'Bullish signals', value: bullish.toString(), color: 'var(--green)' },
    { label: 'Bearish signals', value: bearish.toString(), color: 'var(--red)' },
    { label: 'Strategies saved', value: strategies.length.toString(), color: 'var(--indigo)' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>Dashboard</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={() => refreshC()} style={{
          background: 'none', border: '0.5px solid var(--border)', borderRadius: '7px',
          padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px',
        }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '1.5rem' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{
            background: 'var(--bg-card)', border: '0.5px solid var(--border)',
            borderRadius: '10px', padding: '14px 16px',
          }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>{m.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 600, color: m.color ?? 'var(--text-primary)' }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
        {[{ title: 'Top gainers', data: topGainers }, { title: 'Top losers', data: topLosers }].map(({ title, data }) => (
          <div key={title} style={{
            background: 'var(--bg-card)', border: '0.5px solid var(--border)',
            borderRadius: '10px', padding: '14px 16px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '12px' }}>{title}</p>
            {cLoading ? (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Loading...</p>
            ) : data.map((item) => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '5px 0',
                borderBottom: '0.5px solid var(--border)',
              }}>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{item.symbol}</span>
                <span style={{ fontSize: '12px', color: changeColor(item.change24h), fontWeight: 500 }}>
                  {formatChange(item.change24h)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
        {[
          { href: '/crypto', label: 'Crypto markets', desc: `${prices.length} pairs tracked` },
          { href: '/forex', label: 'Forex markets', desc: `${rates.length} pairs tracked` },
          { href: '/strategies', label: 'My strategies', desc: `${strategies.length} saved` },
          { href: '/watchlist', label: 'Watchlist', desc: 'Your saved pairs' },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{
            background: 'var(--bg-card)', border: '0.5px solid var(--border)',
            borderRadius: '10px', padding: '14px 16px', textDecoration: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</p>
            </div>
            <ArrowUpRight size={14} color="var(--text-muted)" />
          </Link>
        ))}
      </div>
    </div>
  )
}
