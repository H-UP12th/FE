import { request } from './client'

// 내 정보: { userId, loginId, name, profileImageUrl, counts: { bookmarked, created, recentViewed } }
export const getMe = (options) => request('/api/users/me', options)
