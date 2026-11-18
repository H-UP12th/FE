import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'
import BackHeader from '../components/BackHeader'
import Button from '../components/Button'
import TextField from '../components/TextField'
import styles from './pages.module.css'

// 02 회원가입: 닉네임은 API의 loginId로 보내요
export default function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup(Object.fromEntries(new FormData(event.currentTarget)))
      navigate('/onboarding/1', { replace: true })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.screen}>
      <BackHeader />
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <TextField label="성명" name="name" placeholder="성명" autoComplete="name" />
          <TextField label="닉네임" name="loginId" placeholder="닉네임" autoComplete="username" />
          <TextField
            label="비밀번호"
            name="password"
            type="password"
            placeholder="비밀번호"
            autoComplete="new-password"
          />
          <TextField
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
          />
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" disabled={submitting}>
          다음
        </Button>
      </form>
    </div>
  )
}
