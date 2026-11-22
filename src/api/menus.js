import { request } from './client'

// 카테고리별 메뉴 목록: [{ menuId, name, imageUrl, author }]
export const getMenus = (category, options) =>
  request(`/api/menus?category=${encodeURIComponent(category)}`, options).then((data) => data.menus)

// 인기 메뉴 TOP 5: [{ rank, menuId, name, imageUrl }]
export const getPopularMenus = () => request('/api/menus/popular').then((data) => data.menus)
