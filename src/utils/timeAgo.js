// "2026-11-23T14:05:00" → 방금 / 5분 전 / 3시간 전 / 2일 전 / 2026.11.01
// 서버는 한국 시간을 시간대 없이 보내서, 시간대 표시가 없으면 +09:00으로 읽어요
export function timeAgo(dateTime, now = new Date()) {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(dateTime)
  const date = new Date(hasZone ? dateTime : `${dateTime}+09:00`)
  const minutes = Math.floor((now - date) / 60000)
  if (minutes < 1) return '방금'
  if (minutes < 60) return `${minutes}분 전`
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}시간 전`
  if (minutes < 60 * 24 * 7) return `${Math.floor(minutes / (60 * 24))}일 전`
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
}
