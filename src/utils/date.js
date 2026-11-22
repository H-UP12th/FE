const DAYS = ['일', '월', '화', '수', '목', '금', '토']

// "2026-11-18" → "11.18 (수)"
export function formatDay(value) {
  const [y, m, d] = value.split('-').map(Number)
  return `${formatShort(value)} (${DAYS[new Date(y, m - 1, d).getDay()]})`
}

// "2026-11-18" → "11.18"
export function formatShort(value) {
  const [, m, d] = value.split('-').map(Number)
  return `${m}.${String(d).padStart(2, '0')}`
}
