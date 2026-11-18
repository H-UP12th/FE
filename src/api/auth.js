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

export const login = (body) => postAuth('login', body)
export const isLoggedIn = () => Boolean(localStorage.getItem('accessToken'))
