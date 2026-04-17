'use client'
import { useState } from 'react'
import { useStrategies } from '@/lib/hooks/useStrategies'
import { Strategy, SignalType, MarketType } from '@/lib/types/strategy'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import SetupScanner from './_components/SetupScanner'

const SIGNAL_LABELS: Record<SignalType, string> = {
  'bullish-reversal': 'Bullish reversal',
  'bearish-reversal': 'Bearish reversal',
  'continuation': 'Continuation',
  'breakout': 'Breakout',
  'scalp': 'Scalp',
}

const SIGNAL_COLORS: Record<SignalType, string> = {
  'bullish-reversal': 'var(--green)',
  'bearish-reversal': 'var(--red)',
  'continuation': 'var(--indigo)',
  'breakout': 'var(--amber)',
  'scalp': 'var(--text-secondary)',
}

const ALL_PATTERNS = [
  'Doji', 'Long-legged Doji', 'Gravestone Doji', 'Dragonfly Doji',
  'Hammer', 'Inverted Hammer', 'Hanging Man', 'Shooting Star',
  'Marubozu', 'Spinning Top', 'Bullish Engulfing', 'Bearish Engulfing',
  'Bullish Harami', 'Bearish Harami', 'Piercing Line', 'Dark Cloud Cover',
  'Tweezers', 'Morning Star', 'Evening Star', 'Three White Soldiers', 'Three Black Crows',
]

const EMPTY: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', description: '', signalType: 'bullish-reversal',
  marketType: 'crypto', patterns: [], entryRules: '', exitRules: '', notes: '',
}

export default function StrategiesPage() {
  const { strategies, add, update, remove } = useStrategies()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY)

  const handleSubmit = () => {
    if (!form.name.trim()) return
    if (editId) {
      update(editId, form)
      setEditId(null)
    } else {
      add(form)
    }
    setForm(EMPTY)
    setShowForm(false)
  }

  const handleEdit = (s: Strategy) => {
    setForm({ name: s.name, description: s.description, signalType: s.signalType, marketType: s.marketType, patterns: s.patterns, entryRules: s.entryRules, exitRules: s.exitRules, notes: s.notes })
    setEditId(s.id)
    setShowForm(true)
  }

  const togglePattern = (p: string) => {
    setForm((f) => ({
      ...f,
      patterns: f.patterns.includes(p) ? f.patterns.filter((x) => x !== p) : [...f.patterns, p],
    }))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg-secondary)', border: '0.5px solid var(--border)',
    borderRadius: '7px', padding: '8px 10px', color: 'var(--text-primary)',
    fontSize: '13px', outline: 'none', marginBottom: '10px',
  }

  return (
    <div>
      <SetupScanner />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Strategies</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Your personal trading playbook</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY) }} style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          background: 'var(--indigo)', border: 'none', borderRadius: '7px',
          padding: '7px 12px', cursor: 'pointer', color: 'white', fontSize: '12px', fontWeight: 500,
        }}>
          <Plus size={13} /> Add strategy
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>{editId ? 'Edit strategy' : 'New strategy'}</h3>
          <input style={inputStyle} placeholder="Strategy name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <select style={{ ...inputStyle, marginBottom: 0 }} value={form.signalType} onChange={(e) => setForm((f) => ({ ...f, signalType: e.target.value as SignalType }))}>
              {Object.entries(SIGNAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select style={{ ...inputStyle, marginBottom: 0 }} value={form.marketType} onChange={(e) => setForm((f) => ({ ...f, marketType: e.target.value as MarketType }))}>
              <option value="crypto">Crypto</option>
              <option value="forex">Forex</option>
              <option value="both">Both</option>
            </select>
          </div>
          <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} placeholder="Entry rules" value={form.entryRules} onChange={(e) => setForm((f) => ({ ...f, entryRules: e.target.value }))} />
          <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} placeholder="Exit rules / stop loss" value={form.exitRules} onChange={(e) => setForm((f) => ({ ...f, exitRules: e.target.value }))} />
          <div style={{ marginBottom: '10px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Patterns used</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {ALL_PATTERNS.map((p) => (
                <button key={p} onClick={() => togglePattern(p)} style={{
                  padding: '3px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer',
                  background: form.patterns.includes(p) ? 'var(--indigo-dim)' : 'var(--bg-secondary)',
                  border: `0.5px solid ${form.patterns.includes(p) ? 'var(--indigo)' : 'var(--border)'}`,
                  color: form.patterns.includes(p) ? 'var(--indigo)' : 'var(--text-secondary)',
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} placeholder="Notes / journal" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY) }} style={{ background: 'none', border: '0.5px solid var(--border)', borderRadius: '7px', padding: '6px 14px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '12px' }}>Cancel</button>
            <button onClick={handleSubmit} style={{ background: 'var(--indigo)', border: 'none', borderRadius: '7px', padding: '6px 14px', cursor: 'pointer', color: 'white', fontSize: '12px', fontWeight: 500 }}>Save</button>
          </div>
        </div>
      )}

      {strategies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '13px' }}>
          No strategies yet. Add your first one.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {strategies.map((s) => (
            <div key={s.id} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{s.name}</span>
                    <span style={{ fontSize: '10px', color: SIGNAL_COLORS[s.signalType], background: SIGNAL_COLORS[s.signalType] + '20', padding: '1px 6px', borderRadius: '4px' }}>{SIGNAL_LABELS[s.signalType]}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '1px 6px', borderRadius: '4px' }}>{s.marketType}</span>
                  </div>
                  {s.description && <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{s.description}</p>}
                  {s.entryRules && <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}><strong style={{ color: 'var(--green)' }}>Entry:</strong> {s.entryRules}</p>}
                  {s.exitRules && <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}><strong style={{ color: 'var(--red)' }}>Exit:</strong> {s.exitRules}</p>}
                  {s.patterns.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                      {s.patterns.map((p) => <span key={p} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{p}</span>)}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginLeft: '12px' }}>
                  <button onClick={() => handleEdit(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit2 size={13} /></button>
                  <button onClick={() => remove(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
