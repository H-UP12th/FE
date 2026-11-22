import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import { getMemo, getPastMemos, saveMemo } from '../api/memo'
import Header from '../components/Header'
import PageTitle from '../components/PageTitle'
import { formatDay, formatShort } from '../utils/date'
import styles from './Memo.module.css'

const MAX_LENGTH = 500

// 19 자유 메모 - 오늘 메모 쓰기 + 지난 메모 카드 (/memo)
export default function Memo() {
  const [date, setDate] = useState('')
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState('')
  const [pastMemos, setPastMemos] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getMemo({ signal })
      .then((memo) => {
        if (signal.aborted) return
        setDate(memo.date)
        setContent(memo.content ?? '')
        setSaved(memo.content ?? '')
      })
      .catch((err) => !signal.aborted && setError(err.message))
    getPastMemos({ signal })
      .then((memos) => !signal.aborted && setPastMemos(memos))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  if (!isLoggedIn()) return <Navigate to="/start" replace />

  async function handleSave() {
    setError('')
    setSaving(true)
    try {
      const memo = await saveMemo(content)
      setSaved(memo.content ?? '')
      setJustSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const changed = content !== saved

  return (
    <div className={styles.screen}>
      <Header />

      <div className={styles.body}>
        <PageTitle title="Memo" date={date && formatDay(date)} />

        <section className={styles.paper}>
          <span className={styles.tape} />
          <div className={styles.paperHeader}>
            <label htmlFor="memo">자유 메모</label>
            {date && <span>{formatShort(date)}</span>}
          </div>
          <textarea
            id="memo"
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_LENGTH}
            placeholder="오늘 기억해둘 것을 적어보세요"
          />
          <span className={styles.length}>
            {content.length} / {MAX_LENGTH}
          </span>
        </section>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="button" className={styles.save} onClick={handleSave} disabled={!changed || saving}>
          {justSaved && !changed ? '저장했어요' : '저장하기'}
        </button>

        {pastMemos.length > 0 && (
          <section className={styles.past}>
            <h2>지난 메모</h2>
            <ul className={styles.cards}>
              {pastMemos.map((memo) => (
                <li key={memo.date} className={styles.card}>
                  <time dateTime={memo.date}>{formatShort(memo.date)}</time>
                  <p>{memo.content}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
