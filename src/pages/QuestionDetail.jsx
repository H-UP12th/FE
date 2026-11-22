import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import { getQuestion } from '../api/questions'
import BackHeader from '../components/BackHeader'
import Button from '../components/Button'
import QuestionCard from '../components/QuestionCard'
import { timeAgo } from '../utils/timeAgo'
import answerDivider from '../assets/question/answer-divider.svg'
import answerAvatar from '../assets/question/answer-avatar.svg'
import styles from './QuestionDetail.module.css'

// 15 질문 상세(답변 있음), 16 질문 상세(답변 없음 · 식단 작성자)
// [답변하기]는 식단 작성자(canAnswer)에게만 보여요
export default function QuestionDetail() {
  const { menuId, questionId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState({ key: null, question: null, error: '' })
  const key = `${menuId}/${questionId}`

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getQuestion(menuId, questionId, { signal })
      .then((question) => !signal.aborted && setResult({ key, question, error: '' }))
      .catch((err) => !signal.aborted && setResult({ key, question: null, error: err.message }))
    return () => controller.abort()
  }, [menuId, questionId, key])

  if (!isLoggedIn()) return <Navigate to="/start" replace />

  const question = result.key === key ? result.question : null
  const error = result.key === key ? result.error : ''

  return (
    <div className={styles.screen}>
      <BackHeader title="질문 상세" />

      {error && <p className={styles.error}>{error}</p>}

      {question && (
        <>
          <div className={styles.body}>
            <QuestionCard question={question} />

            <section className={styles.answers}>
              <p className={styles.answerCount}>
                답변 <span>{question.answers.length}</span>
              </p>
              <img src={answerDivider} alt="" className={styles.divider} />

              {question.answers.length === 0 ? (
                <div className={styles.noAnswer}>
                  <p className={styles.noAnswerTitle}>아직 답변하지 않은 질문이에요.</p>
                  {question.canAnswer && (
                    <p>
                      재료나 조리 방법에 대해
                      <br />
                      식단 작성자의 답변을 남겨주세요.
                    </p>
                  )}
                </div>
              ) : (
                question.answers.map((answer) => (
                  <div key={answer.answerId} className={styles.answerCard}>
                    <div className={styles.answerHeader}>
                      <span className={styles.answerAuthor}>
                        <img src={answerAvatar} alt="" width="18" height="18" />
                        {answer.loginId}
                      </span>
                      <time dateTime={answer.createdAt} className={styles.time}>
                        {timeAgo(answer.createdAt)}
                      </time>
                    </div>
                    <p className={styles.answerContent}>{answer.content}</p>
                  </div>
                ))
              )}
            </section>
          </div>

          <div className={styles.footer}>
            {question.canAnswer && (
              <>
                {question.answers.length === 0 && (
                  <p className={styles.ownerNote}>이 버튼은 해당 식단을 올린 작성자에게만 보여요.</p>
                )}
                <Button onClick={() => navigate(`/menus/${menuId}/questions/${questionId}/answer`)}>답변하기</Button>
              </>
            )}
            <p className={styles.notice}>질문과 답변은 다른 사용자에게도 보여요.</p>
          </div>
        </>
      )}
    </div>
  )
}
