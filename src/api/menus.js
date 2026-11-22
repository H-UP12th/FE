import { request } from './client'

// 카테고리별 메뉴 목록: [{ menuId, name, imageUrl, author }]
export const getMenus = (category, options) =>
  request(`/api/menus?category=${encodeURIComponent(category)}`, options).then((data) => data.menus)

// 인기 메뉴 TOP 5: [{ rank, menuId, name, imageUrl }]
export const getPopularMenus = () => request('/api/menus/popular').then((data) => data.menus)

// 메뉴 상세: 영양 정보, 재료, 만드는 법, 대체 재료, 별점, 북마크 여부 등
export const getMenu = (menuId, options) => request(`/api/menus/${menuId}`, options)

// 별점 등록(다시 남기면 덮어쓰기): score는 0.0~5.0, 소수 한 자리 → { menuId, myScore, average, count }
export const rateMenu = (menuId, score) =>
  request(`/api/menus/${menuId}/ratings`, { method: 'POST', body: JSON.stringify({ score }) })

// 북마크 저장/해제: { menuId, isBookmarked }
export const setBookmark = (menuId, bookmarked) =>
  request(`/api/menus/${menuId}/bookmarks`, { method: bookmarked ? 'POST' : 'DELETE' })
