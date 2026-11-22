import { Navigate, useNavigate, useNavigationType, useParams } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import Button from '../components/Button'
import PageIndicator from '../components/PageIndicator'
import hero1 from '../assets/onboarding-1.svg'
import hero2 from '../assets/onboarding-2.svg'
import hero3 from '../assets/onboarding-3.svg'
import hero4 from '../assets/onboarding-4.svg'
import logo from '../assets/logo-start.svg'
import styles from './pages.module.css'

const SLIDES = [
  {
    image: hero1,
    title: '오늘 뭐 먹지?\n건강한 한 끼를 찾아요',
    description: '먹고 싶은 식단을 찾고, 만드는 법을 살펴보며\n오늘의 한 끼를 골라보세요.',
  },
  {
    image: hero2,
    title: '내 취향에 맞는\n식단을 골라요',
    description: '저당부터 단백질 식단까지,\n카테고리와 필터로 원하는 메뉴를 찾아보세요.',
  },
  {
    image: hero3,
    title: '어떻게 만들지?\n레시피를 확인해요',
    description: '만드는 방법과 영양 정보를 살펴보고,\n대신 쓸 수 있는 재료도 확인해보세요.',
  },
  {
    image: hero4,
    title: '먹어보고 싶은 메뉴는\n모아두세요',
    description: '마음에 드는 메뉴를 폴더에 저장하고,\n다음 한 끼가 고민될 때 꺼내보세요.',
  },
]

// 04~07 온보딩 슬라이드, 08 시작 화면 (/onboarding/1 ~ /onboarding/5)
export default function Onboarding() {
  const navigate = useNavigate()
  const step = Number(useParams().step)

  // [다음](PUSH)은 오른쪽에서, 뒤로가기(POP)는 왼쪽에서 들어와요
  const enterClass = useNavigationType() === 'POP' ? styles.enterPrev : styles.enterNext

  if (!Number.isInteger(step) || step < 1 || step > SLIDES.length + 1) {
    return <Navigate to="/onboarding/1" replace />
  }

  if (step > SLIDES.length) {
    return (
      <div className={styles.screen}>
        <main className={`${styles.onboardingStart} ${styles.fadeIn}`}>
          <img src={logo} alt="핼팅" width="119" height="96" />
          <p className={styles.startText}>{'오늘의 건강한 한 끼,\n핼팅에서 찾아볼까요?'}</p>
        </main>
        <div className={styles.footer}>
          <Button onClick={() => navigate('/', { replace: true, state: { openFridge: true } })}>시작하기</Button>
        </div>
      </div>
    )
  }

  const slide = SLIDES[step - 1]

  return (
    <div className={styles.screen}>
      <BackHeader showBack={step > 1} />
      {/* key가 바뀌면 새로 그려지면서 들어오는 애니메이션이 다시 실행돼요 */}
      <main key={step} className={`${styles.slide} ${enterClass}`}>
        <img src={slide.image} alt="" width="163.8" height="163.8" />
        <div className={styles.slideText}>
          <h1 className={styles.slideTitle}>{slide.title}</h1>
          <p className={styles.slideDescription}>{slide.description}</p>
        </div>
      </main>
      <div className={styles.slideFooter}>
        <PageIndicator step={step} />
        <Button onClick={() => navigate(`/onboarding/${step + 1}`)}>다음</Button>
      </div>
    </div>
  )
}
