const FALLBACK_ERROR = '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'

// 실패하면 서버가 보낸 message를 담아 에러를 던져요 (화면에 그대로 표시)
async function postAuth(path, body) {
  let result
  try {
    const response = await fetch(`/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    result = await response.json()
  } catch {
    throw new Error(FALLBACK_ERROR)
  }

  if (!result.success) throw new Error(result.message ?? FALLBACK_ERROR)

  localStorage.setItem('accessToken', result.data.accessToken)
  localStorage.setItem('refreshToken', result.data.refreshToken)
  return result.data
}

export const signup = (body) => postAuth('signup', body)
export const login = (body) => postAuth('login', body)
export const isLoggedIn = () => Boolean(localStorage.getItem('accessToken'))

// 로그아웃: 서버에 알리고, 성공·실패(401 등)와 상관없이 토큰을 지워요
// 서버가 잠들어 있으면 오래 걸리니 5초만 기다려요 (다음 로그인 때 냉장고 문 모션도 다시 보이게)
export async function logout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    // 응답이 없어도 로그아웃은 진행해요
  }
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  sessionStorage.removeItem('fridgeOpened')
}
