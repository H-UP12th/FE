const FALLBACK_ERROR = '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'

function send(path, options) {
  const token = localStorage.getItem('accessToken')
  // 파일 업로드(FormData)는 브라우저가 Content-Type을 정해야 해서 비워둬요
  const json = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }
  return fetch(path, {
    ...options,
    headers: { ...json, ...options.headers, Authorization: `Bearer ${token}` },
  })
}

// AccessToken(1시간)이 만료되면 RefreshToken으로 새로 받아요
async function reissue() {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return false
  try {
    const response = await fetch('/api/auth/reissue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const result = await response.json()
    if (!result.success) return false
    localStorage.setItem('accessToken', result.data.accessToken)
    localStorage.setItem('refreshToken', result.data.refreshToken)
    return true
  } catch {
    return false
  }
}

// 로그인이 필요한 API 요청: 성공하면 data를, 실패하면 서버 message를 담은 에러를 던져요
export async function request(path, options = {}) {
  let response
  try {
    response = await send(path, options)
    if (response.status === 401 && (await reissue())) response = await send(path, options)
  } catch {
    throw new Error(FALLBACK_ERROR)
  }

  // 재발급도 실패하면 다시 로그인하도록 처음 화면으로 보내요
  if (response.status === 401) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.replace('/start')
    throw new Error('로그인이 필요해요.')
  }

  const result = await response.json().catch(() => ({}))
  if (!result.success) throw new Error(result.message ?? FALLBACK_ERROR)
  return result.data
}
