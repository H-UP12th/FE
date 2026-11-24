import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { BiSolidUserCircle } from 'react-icons/bi'
import { checkLoginId, isLoggedIn } from '../api/auth'
import { getMe, updateProfile, updateProfileImage } from '../api/users'
import BackHeader from '../components/BackHeader'
import Button from '../components/Button'
import TextField from '../components/TextField'
import styles from './ProfileEdit.module.css'

// 21 프로필 수정 (/mypage/edit)
// 사진은 고르면 바로 저장하고, 성명·닉네임은 바뀐 값만 [수정하기]로 보내요
// 비밀번호는 세 칸 중 하나라도 쓰면 바꾸려는 걸로 보고, 현재 비밀번호와 새 비밀번호를 같이 보내요
export default function ProfileEdit() {
  const navigate = useNavigate()
  const [me, setMe] = useState(null)
  const [name, setName] = useState('')
  const [loginId, setLoginId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  // 마지막으로 중복 확인한 닉네임과 결과 (available: null이면 확인 실패 → 서버 응답에 맡겨요)
  const [idCheck, setIdCheck] = useState({ loginId: '', available: null })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getMe({ signal })
      .then((data) => {
        if (signal.aborted) return
        setMe(data)
        setName(data.name)
        setLoginId(data.loginId)
        setImageUrl(data.profileImageUrl ?? '')
      })
      .catch((err) => !signal.aborted && setError(err.message))
    return () => controller.abort()
  }, [])

  // 닉네임을 바꾸면 입력이 멈추고 0.4초 뒤에 중복 확인해요
  const targetId = loginId.trim()
  useEffect(() => {
    if (!me || !targetId || targetId === me.loginId) return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      checkLoginId(targetId, { signal: controller.signal })
        .then((available) => setIdCheck({ loginId: targetId, available }))
        .catch(() => !controller.signal.aborted && setIdCheck({ loginId: targetId, available: null }))
    }, 400)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [me, targetId])

  if (!isLoggedIn()) return <Navigate to="/start" replace />

  const changes = {}
  if (me && name.trim() !== me.name) changes.name = name.trim()
  if (me && loginId.trim() !== me.loginId) changes.loginId = loginId.trim()
  // 비밀번호를 바꾸려면 세 칸을 다 채우고, 새 비밀번호와 확인이 같아야 해요
  const changingPassword = Boolean(currentPassword || newPassword || confirmPassword)
  const passwordError = changingPassword && confirmPassword && newPassword !== confirmPassword ? '새 비밀번호가 서로 달라요' : ''
  const passwordReady = currentPassword && newPassword && confirmPassword && !passwordError
  if (changingPassword && passwordReady) {
    changes.currentPassword = currentPassword
    changes.password = newPassword
  }

  const changed = Object.keys(changes).length > 0
  const empty = !name.trim() || !loginId.trim()
  const loginIdChanged = Boolean(me && targetId && targetId !== me.loginId)
  const checkingId = loginIdChanged && idCheck.loginId !== targetId
  const duplicateId = loginIdChanged && idCheck.loginId === targetId && idCheck.available === false
  const blocked = (changingPassword && !passwordReady) || checkingId || duplicateId

  async function handlePhoto(file) {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const data = await updateProfileImage(file)
      setImageUrl(data.profileImageUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await updateProfile(changes)
      navigate(-1)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className={styles.screen}>
      <BackHeader />

      <form className={styles.body} onSubmit={handleSubmit}>
        <h1 className={styles.title}>프로필 수정</h1>

        <div className={styles.photo}>
          {imageUrl ? (
            <img src={imageUrl} alt="" className={styles.avatar} />
          ) : (
            <BiSolidUserCircle size={56} className={styles.avatarIcon} aria-hidden="true" />
          )}
          <label className={styles.photoButton} aria-disabled={uploading}>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className={styles.fileInput}
              disabled={uploading}
              onChange={(e) => handlePhoto(e.target.files[0])}
            />
            {uploading ? '올리는 중…' : '프로필 사진 바꾸기'}
          </label>
        </div>

        <div className={styles.fields}>
          <TextField label="성명" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} autoComplete="name" />
          <TextField
            label="닉네임"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            maxLength={30}
            autoComplete="username"
            aria-invalid={duplicateId}
            aria-describedby={duplicateId ? 'login-id-error' : undefined}
          />
          {duplicateId && (
            <p id="login-id-error" className={styles.fieldError} role="alert">
              이미 사용 중인 닉네임이에요
            </p>
          )}

          <div className={styles.password}>
            <div>
              <p className={styles.passwordTitle}>비밀번호 변경</p>
              <p className={styles.passwordSub}>비밀번호를 바꿀 때만 입력하세요</p>
            </div>
            <TextField
              label="현재 비밀번호"
              type="password"
              placeholder="현재 비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
            <TextField
              label="새 비밀번호"
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <TextField
              label="새 비밀번호 확인"
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            {passwordError && <p className={styles.error}>{passwordError}</p>}
          </div>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <Button type="submit" disabled={!changed || empty || blocked || saving}>
          수정하기
        </Button>
      </form>
    </div>
  )
}
