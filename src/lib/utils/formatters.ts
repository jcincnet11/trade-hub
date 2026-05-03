export const formatPrice = (price: number): string => {
  if (price >= 10000) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (price >= 1)
    return (
      '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    )
  if (price >= 0.01) return '$' + price.toFixed(4)
  return '$' + price.toFixed(6)
}

export const formatChange = (change: number): string => {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

export const formatVolume = (vol: number): string => {
  if (vol >= 1e9) return '$' + (vol / 1e9).toFixed(2) + 'B'
  if (vol >= 1e6) return '$' + (vol / 1e6).toFixed(2) + 'M'
  return '$' + vol.toLocaleString()
}

export const formatMarketCap = (mc: number): string => {
  if (mc >= 1e12) return '$' + (mc / 1e12).toFixed(2) + 'T'
  if (mc >= 1e9) return '$' + (mc / 1e9).toFixed(2) + 'B'
  return '$' + (mc / 1e6).toFixed(0) + 'M'
}

export const changeColor = (change: number): string => {
  if (change > 0) return 'var(--green)'
  if (change < 0) return 'var(--red)'
  return 'var(--text-secondary)'
}
