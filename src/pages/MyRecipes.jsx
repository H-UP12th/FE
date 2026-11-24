import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import { getMyMenus } from '../api/users'
import BackHeader from '../components/BackHeader'
import Button from '../components/Button'
import RecipeItem from '../components/RecipeItem'
import netBag from '../assets/mypage/net-bag.png'
import chefHat from '../assets/mypage/chef-hat.png'
import history from '../assets/mypage/history.svg'
import styles from './MyRecipes.module.css'

// 22 저장한 / 23 내가 만든 / 24 최근 본 레시피 (+ 각 빈 화면 -1)
// 23의 승인 대기·공개 배지는 백엔드에 status가 생기면 붙여요
const PAGES = {
  bookmarks: {
    api: 'bookmarks',
    title: '저장한 레시피',
    icon: netBag,
    iconSize: [47.5, 47.5],
    emptyTitle: '아직 저장한 레시피가 없어요',
    emptySub: '마음에 드는 식단을 북마크해 보세요',
    action: { label: '식단 둘러보기', to: '/' },
  },
  menus: {
    api: 'menus',
    title: '내가 만든 레시피',
    icon: chefHat,
    iconSize: [48, 48],
    emptyTitle: '아직 만든 레시피가 없어요',
    emptySub: '나만의 건강 식단을 공유해 보세요',
    action: { label: '레시피 작성하기', to: '/menus/new' },
  },
  recent: {
    api: 'recent-menus',
    title: '최근 본 레시피',
    icon: history,
    iconSize: [50, 52],
    emptyTitle: '아직 본 레시피가 없어요',
    emptySub: '냉장고에서 마음에 드는 식단을 골라보세요',
    action: { label: '식단 둘러보기', to: '/' },
  },
}

// 사용법: <MyRecipes kind="bookmarks" /> (/mypage/bookmarks, /mypage/menus, /mypage/recent)
export default function MyRecipes({ kind }) {
  const page = PAGES[kind]
  const navigate = useNavigate()
  const [result, setResult] = useState({ kind: null, menus: [], error: '' })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getMyMenus(page.api, { signal })
      .then((menus) => !signal.aborted && setResult({ kind, menus, error: '' }))
      .catch((err) => !signal.aborted && setResult({ kind, menus: [], error: err.message }))
    return () => controller.abort()
  }, [kind, page.api])

  if (!isLoggedIn()) return <Navigate to="/start" replace />

  const loaded = result.kind === kind
  const { menus, error } = result

  return (
    <div className={styles.screen}>
      <BackHeader />

      <div className={styles.titleRow}>
        <span className={styles.titleIcon}>
          <img src={page.icon} alt="" width={page.iconSize[0]} height={page.iconSize[1]} />
        </span>
        <h1>{page.title}</h1>
      </div>

      <section className={loaded && menus.length === 0 ? styles.emptyCard : styles.card}>
        {loaded && error && <p className={styles.emptyTitle}>{error}</p>}

        {loaded && !error && menus.length === 0 && (
          <>
            <p className={styles.emptyTitle}>{page.emptyTitle}</p>
            <p className={styles.emptySub}>{page.emptySub}</p>
            <Button variant="outline" className={styles.emptyButton} onClick={() => navigate(page.action.to)}>
              {page.action.label}
            </Button>
          </>
        )}

        {menus.map((menu) => (
          <RecipeItem key={menu.menuId} id={menu.menuId} name={menu.name} image={menu.imageUrl} category={menu.category} />
        ))}
      </section>
    </div>
  )
}
