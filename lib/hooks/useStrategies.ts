'use client'
import { useState } from 'react'
import { Strategy } from '../types/strategy'

const KEY = 'trade-hub-strategies'

const loadInitial = (): Strategy[] => {
  if (typeof window === 'undefined') return []
  try {
    const saved = window.localStorage.getItem(KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function useStrategies() {
  const [strategies, setStrategies] = useState<Strategy[]>(loadInitial)

  const save = (list: Strategy[]) => {
    setStrategies(list)
    try { window.localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
  }

  const add = (s: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newS: Strategy = { ...s, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
    save([...strategies, newS])
  }

  const update = (id: string, updates: Partial<Strategy>) => {
    save(strategies.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)))
  }

  const remove = (id: string) => {
    save(strategies.filter((s) => s.id !== id))
  }

  return { strategies, add, update, remove }
}
