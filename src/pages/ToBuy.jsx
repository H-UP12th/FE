import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import { addToBuy, checkToBuy, deleteToBuy, getToBuy } from '../api/toBuy'
import Header from '../components/Header'
import back from '../assets/tobuy/back.svg'
import check from '../assets/tobuy/check.svg'
import styles from './ToBuy.module.css'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

// "2026-11-18" → "11.18 (수)"
function formatDate(value) {
  const [y, m, d] = value.split('-').map(Number)
  return `${m}.${String(d).padStart(2, '0')} (${DAYS[new Date(y, m - 1, d).getDay()]})`
}

// 18 To Buy - 오늘 장보기 리스트 (/to-buy)
// 체크·삭제는 화면을 먼저 바꾸고, 저장이 실패하면 되돌려요
export default function ToBuy() {
  const navigate = useNavigate()
  const [date, setDate] = useState('')
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getToBuy({ signal })
      .then((data) => {
        if (signal.aborted) return
        setDate(data.date)
        setItems(data.items)
        setLoaded(true)
      })
      .catch((err) => !signal.aborted && setError(err.message))
    return () => controller.abort()
  }, [])

  if (!isLoggedIn()) return <Navigate to="/start" replace />

  const checkedCount = items.filter((item) => item.checked).length

  function update(itemId, changes) {
    setItems((prev) => prev.map((item) => (item.itemId === itemId ? { ...item, ...changes } : item)))
  }

  async function toggle(item) {
    setError('')
    update(item.itemId, { checked: !item.checked })
    try {
      await checkToBuy(item.itemId, !item.checked)
    } catch (err) {
      update(item.itemId, { checked: item.checked })
      setError(err.message)
    }
  }

  async function remove(item) {
    setError('')
    const before = items
    setItems((prev) => prev.filter((i) => i.itemId !== item.itemId))
    try {
      await deleteToBuy(item.itemId)
    } catch (err) {
      setItems(before)
      setError(err.message)
    }
  }

  async function handleAdd(event) {
    event.preventDefault()
    if (!name.trim()) return
    setError('')
    try {
      const item = await addToBuy(name.trim(), amount.trim())
      setItems((prev) => [...prev, item])
      setName('')
      setAmount('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.screen}>
      <Header />

      <div className={styles.body}>
        <div className={styles.title}>
          <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="뒤로가기">
            <img src={back} alt="" width="24" height="24" />
          </button>
          <h1>To Buy</h1>
          {date && <span className={styles.date}>{formatDate(date)}</span>}
        </div>

        {loaded && (
          <section className={styles.memo}>
            <span className={styles.tape} />
            <div className={styles.memoHeader}>
              <h2>장보기 리스트</h2>
              <span>
                {checkedCount}/{items.length}
              </span>
            </div>
            <div className={styles.progress}>
              <span style={{ width: items.length ? `${(checkedCount / items.length) * 100}%` : 0 }} />
            </div>

            <ul className={styles.items}>
              {items.map((item) => (
                <li key={item.itemId} className={styles.item}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggle(item)}
                      className={styles.checkInput}
                    />
                    <span className={styles.box}>{item.checked && <img src={check} alt="" width="14" height="14" />}</span>
                    <span className={item.checked ? styles.nameDone : styles.name}>{item.name}</span>
                  </label>
                  {item.amount && <span className={styles.amount}>{item.amount}</span>}
                  <button type="button" className={styles.remove} onClick={() => remove(item)} aria-label={`${item.name} 삭제`}>
                    ×
                  </button>
                </li>
              ))}
            </ul>

            {adding ? (
              <form className={styles.addForm} onSubmit={handleAdd}>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}
                  placeholder="재료명"
                  maxLength={50}
                  aria-label="재료명"
                  className={styles.addName}
                />
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="분량"
                  maxLength={30}
                  aria-label="분량"
                  className={styles.addAmount}
                />
                <button type="submit" className={styles.addSubmit} disabled={!name.trim()}>
                  추가
                </button>
              </form>
            ) : (
              <button type="button" className={styles.addRow} onClick={() => setAdding(true)}>
                +&nbsp;&nbsp;재료 추가하기
              </button>
            )}
          </section>
        )}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
