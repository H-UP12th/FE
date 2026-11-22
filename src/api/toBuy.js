import { request } from './client'

const BASE = '/api/users/me/to-buy'

// 오늘(date 없으면) 장보기 리스트: { date, totalCount, checkedCount, items: [{ itemId, date, name, amount, checked }] }
export const getToBuy = (options) => request(BASE, options)

// 재료 추가(이름 50자, 분량 30자 이내) → 추가된 항목
export const addToBuy = (name, amount) =>
  request(BASE, { method: 'POST', body: JSON.stringify({ name, amount: amount || null }) })

export const checkToBuy = (itemId, checked) =>
  request(`${BASE}/${itemId}`, { method: 'PATCH', body: JSON.stringify({ checked }) })

export const deleteToBuy = (itemId) => request(`${BASE}/${itemId}`, { method: 'DELETE' })
