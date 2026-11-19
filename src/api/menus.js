import { request } from './client'

// 인기 메뉴 TOP 5: [{ rank, menuId, name, imageUrl }]
export const getPopularMenus = () => request('/api/menus/popular').then((data) => data.menus)
