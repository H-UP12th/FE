import { request } from './client'

// 내 정보: { userId, loginId, name, profileImageUrl, counts: { bookmarked, created, recentViewed } }
export const getMe = (options) => request('/api/users/me', options)

// 성명·닉네임 수정 (바꿀 값만 보내요) → { userId, loginId, name, profileImageUrl }
export const updateProfile = (changes) =>
  request('/api/users/me', { method: 'PATCH', body: JSON.stringify(changes) })

// 프로필 사진 바꾸기 (jpg·png) → { profileImageUrl }
export function updateProfileImage(file) {
  const form = new FormData()
  form.append('image', file)
  return request('/api/users/me/profile-image', { method: 'PATCH', body: form })
}

// 마이페이지 레시피 목록: kind는 bookmarks(저장한) / menus(내가 만든) / recent-menus(최근 본)
// → [{ menuId, category, name, imageUrl, ...시각 }]
export const getMyMenus = (kind, options) =>
  request(`/api/users/me/${kind}`, options).then((data) => data.menus)
