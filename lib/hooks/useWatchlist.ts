'use client'
import { useState } from 'react'

const KEY = 'trade-hub-watchlist'

const loadInitial = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const saved = window.localStorage.getItem(KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(loadInitial)

  const save = (list: string[]) => {
    setWatchlist(list)
    try { window.localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
  }

  const add = (id: string) => {
    if (!watchlist.includes(id)) save([...watchlist, id])
  }

  const remove = (id: string) => save(watchlist.filter((w) => w !== id))

  const toggle = (id: string) => (watchlist.includes(id) ? remove(id) : add(id))

  const isWatched = (id: string) => watchlist.includes(id)

  return { watchlist, add, remove, toggle, isWatched }
}
