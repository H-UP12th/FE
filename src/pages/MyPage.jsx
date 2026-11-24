import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BiSolidUserCircle } from 'react-icons/bi'
import { isLoggedIn, logout } from '../api/auth'
import { getMe } from '../api/users'
import BackHeader from '../components/BackHeader'
import Button from '../components/Button'
import netBag from '../assets/mypage/net-bag.png'
import chefHat from '../assets/mypage/chef-hat.png'
import history from '../assets/mypage/history-small.svg'
import styles from './MyPage.module.css'

// 나의 기록 버블: counts 키, 목록 주소, 아이콘, 배경색
const RECORDS = [
  { key: 'bookmarked', label: '저장한 레시피', to: '/mypage/bookmarks', icon: netBag, color: 'var(--tag-pink)' },
  { key: 'created', label: '내가 만든 레시피', to: '/mypage/menus', icon: chefHat, color: 'var(--yellow-light)' },
  { key: 'recentViewed', label: '최근 본 레시피', to: '/mypage/recent', icon: history, color: 'var(--tag-green)' },
]

const SHORTCUTS = [
  { label: 'TO-BUY', text: '장보기 리스트', to: '/to-buy', color: 'var(--tag-pink)' },
  { label: 'MEMO', text: '자유 메모', to: '/memo', color: 'var(--yellow-light)' },
]

// 20 마이페이지 + 20-1 로그아웃 확인 (/mypage)
export default function MyPage() {
  const navigate = useNavigate()
  const dialogRef = useRef(null)
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getMe({ signal })
      .then((data) => !signal.aborted && setMe(data))
      .catch((err) => !signal.aborted && setError(err.message))
    return () => controller.abort()
  }, [])

  if (!isLoggedIn()) return <Navigate to="/start" replace />

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
    navigate('/start', { replace: true })
  }

  return (
    <div className={styles.screen}>
      <BackHeader />

      <div className={styles.body}>
        <h1 className={styles.title}>마이페이지</h1>

        {error && <p className={styles.error}>{error}</p>}

        <section className={styles.profile}>
          {me?.profileImageUrl ? (
            <img src={me.profileImageUrl} alt="" className={styles.avatar} />
          ) : (
            <BiSolidUserCircle size={60} className={styles.avatarIcon} aria-hidden="true" />
          )}
          <div className={styles.names}>
            <p className={styles.name}>{me?.name}</p>
            {me && <p className={styles.loginId}>@{me.loginId}</p>}
          </div>
          <Link to="/mypage/edit" className={styles.edit}>
            수정
          </Link>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>나의 기록</h2>
          <div className={styles.records}>
            {RECORDS.map((record) => (
              <Link key={record.key} to={record.to} className={styles.record}>
                <span className={styles.bubble} style={{ background: record.color }}>
                  <img src={record.icon} alt="" width="30" height="30" />
                  <strong>{me ? me.counts[record.key] : '-'}</strong>
                </span>
                {record.label}
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>냉장고 바로가기</h2>
          {SHORTCUTS.map((item) => (
            <Link key={item.to} to={item.to} className={styles.shortcut}>
              <span className={styles.shortcutLabel} style={{ background: item.color }}>
                {item.label}
              </span>
              <span className={styles.shortcutText}>{item.text}</span>
              <span className={styles.arrow} aria-hidden="true">
                ›
              </span>
            </Link>
          ))}
        </section>
      </div>

      <button type="button" className={styles.logout} onClick={() => dialogRef.current.showModal()}>
        로그아웃
      </button>

      {/* 20-1 로그아웃 확인: 바깥을 누르거나 Esc를 누르면 닫혀요 */}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
        aria-labelledby="logout-title"
      >
        <p id="logout-title" className={styles.dialogTitle}>
          로그아웃할까요?
        </p>
        <div className={styles.dialogButtons}>
          <Button variant="outline" onClick={() => dialogRef.current.close()}>
            취소
          </Button>
          <Button onClick={handleLogout} disabled={loggingOut}>
            로그아웃
          </Button>
        </div>
      </dialog>
    </div>
  )
}
