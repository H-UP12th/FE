import { request } from './client'

// 카테고리별 메뉴 목록: [{ menuId, name, imageUrl, author }]
export const getMenus = (category, options) =>
  request(`/api/menus?category=${encodeURIComponent(category)}`, options).then((data) => data.menus)

// 인기 메뉴 TOP 5: [{ rank, menuId, name, imageUrl }]
export const getPopularMenus = () => request('/api/menus/popular').then((data) => data.menus)

// 메뉴 상세: 영양 정보, 재료, 만드는 법, 대체 재료, 별점, 북마크 여부 등
export const getMenu = (menuId, options) => request(`/api/menus/${menuId}`, options)

// 북마크 저장/해제: { menuId, isBookmarked }
export const setBookmark = (menuId, bookmarked) =>
  request(`/api/menus/${menuId}/bookmarks`, { method: bookmarked ? 'POST' : 'DELETE' })
