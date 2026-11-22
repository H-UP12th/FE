import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import { createAnswer, getQuestion } from '../api/questions'
import { getMe } from '../api/users'
import BackHeader from '../components/BackHeader'
import Button from '../components/Button'
import QuestionCard from '../components/QuestionCard'
import ownerAvatar from '../assets/question/owner-avatar.svg'
import styles from './QuestionDetail.module.css'

const MAX_LENGTH = 1000

// 17 답변 작성 (식단 작성자만) /menus/:menuId/questions/:questionId/answer
export default function AnswerWrite() {
  const { menuId, questionId } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [myLoginId, setMyLoginId] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getQuestion(menuId, questionId, { signal })
      .then((q) => !signal.aborted && setQuestion(q))
      .catch((err) => !signal.aborted && setError(err.message))
    getMe({ signal })
      .then((me) => !signal.aborted && setMyLoginId(me.loginId))
      .catch(() => {})
    return () => controller.abort()
  }, [menuId, questionId])

  if (!isLoggedIn()) return <Navigate to="/start" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createAnswer(menuId, questionId, content.trim())
      // 질문 상세로 돌아가면 새 답변까지 다시 불러와요
      navigate(-1)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.screen}>
      <BackHeader title="답변 작성" />

      {question && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.body}>
            <QuestionCard question={question} />

            <section className={styles.write}>
              <p className={styles.owner}>
                <span className={styles.ownerName}>
                  <img src={ownerAvatar} alt="" width="17" height="17" />
                  {myLoginId}
                </span>
                <span className={styles.ownerBadge}>식단 작성자</span>
              </p>
              <label htmlFor="answer" className={styles.writeLabel}>
                답변 내용
              </label>
              <textarea
                id="answer"
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={MAX_LENGTH}
                placeholder={'질문에 대한 답변을 입력해주세요.\n재료 사용법이나 조리 팁을 알려주세요.'}
                disabled={!question.canAnswer}
              />
              <p className={styles.length}>
                {content.length} / {MAX_LENGTH.toLocaleString()}
              </p>
            </section>
          </div>

          <div className={styles.footer}>
            {error ? (
              <p className={styles.formError} role="alert">
                {error}
              </p>
            ) : (
              <p className={styles.ownerNote}>이 식단을 올린 작성자만 답변할 수 있어요.</p>
            )}
            <Button type="submit" disabled={!question.canAnswer || !content.trim() || submitting}>
              답변 등록하기
            </Button>
            <p className={styles.notice}>질문과 답변은 다른 사용자에게도 보여요.</p>
          </div>
        </form>
      )}

      {!question && error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
