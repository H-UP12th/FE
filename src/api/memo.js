import { request } from './client'

// 오늘 메모: { date, content, updatedAt } (아직 안 썼으면 content null)
export const getMemo = (options) => request('/api/users/me/memo', options)

// 오늘 메모 저장(같은 날은 덮어쓰기, 500자 이내, 빈 문자열이면 비우기)
export const saveMemo = (content) =>
  request('/api/users/me/memo', { method: 'PUT', body: JSON.stringify({ content }) })

// 지난 메모(최신 날짜순, 오늘 제외): [{ date, content }]
export const getPastMemos = (options) => request('/api/users/me/memos', options).then((data) => data.memos)
