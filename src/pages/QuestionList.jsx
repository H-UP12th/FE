import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import { getMenu } from '../api/menus'
import { createQuestion, getQuestions } from '../api/questions'
import BackHeader from '../components/BackHeader'
import divider from '../assets/question/divider.svg'
import avatar from '../assets/question/avatar.svg'
import chevron from '../assets/question/chevron.svg'
import send from '../assets/question/send.svg'
import styles from './QuestionList.module.css'

// 14 질문 목록, 14-1 빈 화면 (/menus/:menuId/questions)
// 메뉴 상세에서 오면 메뉴 이름을 state로 받고, 주소로 바로 들어오면 메뉴 API로 이름을 가져와요
export default function QuestionList() {
  const { menuId } = useParams()
  const { state } = useLocation()
  const [menuName, setMenuName] = useState(state?.menuName ?? '')
  const [result, setResult] = useState({ menuId: null, questions: [], error: '' })
  const [content, setContent] = useState('')
  const [sendError, setSendError] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getQuestions(menuId, { signal })
      .then((data) => !signal.aborted && setResult({ menuId, questions: data.questions, error: '' }))
      .catch((err) => !signal.aborted && setResult({ menuId, questions: [], error: err.message }))
    if (!state?.menuName) {
      getMenu(menuId, { signal })
        .then((menu) => !signal.aborted && setMenuName(menu.name))
        .catch(() => {})
    }
    return () => controller.abort()
  }, [menuId, state?.menuName])

  if (!isLoggedIn()) return <Navigate to="/start" replace />

  const loading = result.menuId !== menuId
  const { questions } = result

  async function handleSubmit(event) {
    event.preventDefault()
    const text = content.trim()
    if (!text) return
    setSendError('')
    setSending(true)
    try {
      const question = await createQuestion(menuId, text)
      // 최신순이라 새 질문은 맨 위에
      setResult((prev) => ({ ...prev, questions: [question, ...prev.questions] }))
      setContent('')
    } catch (err) {
      setSendError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.screen}>
      <BackHeader title="질문 목록" />

      <div className={styles.menu}>
        <img src={divider} alt="" className={styles.divider} />
        <p className={styles.menuName}>{menuName}</p>
        <p className={styles.sub}>이 메뉴에 대한 질문을 확인해보세요.</p>
      </div>

      <div className={styles.listHeader}>
        <p className={styles.count}>
          질문 <span>{loading ? '' : questions.length}</span>
        </p>
        {questions.length > 0 && <span className={styles.sub}>최신순</span>}
      </div>

      {!loading && result.error && <p className={styles.empty}>{result.error}</p>}

      {!loading && !result.error && questions.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>?</span>
          <p className={styles.emptyTitle}>아직 질문이 없어요</p>
          <p>이 메뉴에 대해 궁금한 점을 가장 먼저 남겨보세요</p>
        </div>
      )}

      {questions.length > 0 && (
        <ul className={styles.list}>
          {questions.map((q) => (
            <li key={q.questionId}>
              <Link to={`/menus/${menuId}/questions/${q.questionId}`} className={styles.row}>
                <span className={styles.rowTop}>
                  <span className={styles.author}>
                    <img src={avatar} alt="" width="17" height="17" />
                    {q.loginId}
                  </span>
                  <span className={q.answerCount > 0 ? styles.answered : styles.sub}>
                    답변 {q.answerCount}
                  </span>
                </span>
                <span className={styles.rowBottom}>
                  <span className={styles.content}>{q.content}</span>
                  <img src={chevron} alt="" width="5.1" height="9.1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이 메뉴에 대해 궁금한 점을 남겨보세요"
          maxLength={1000}
          aria-label="질문 입력"
        />
        <button type="submit" className={styles.send} disabled={sending || !content.trim()} aria-label="질문 보내기">
          <img src={send} alt="" width="49" height="49" />
        </button>
      </form>
      {sendError ? (
        <p className={styles.sendError} role="alert">
          {sendError}
        </p>
      ) : (
        <p className={styles.notice}>질문과 답변은 다른 사용자에게도 보여요.</p>
      )}
    </div>
  )
}
