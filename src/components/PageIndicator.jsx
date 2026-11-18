import styles from './PageIndicator.module.css'

// 온보딩 진행 단계 점 표시
// 사용법: <PageIndicator step={1} />            → 4단계 중 1단계
//         <PageIndicator step={2} total={5} />  → 5단계 중 2단계
export default function PageIndicator({ step, total = 4 }) {
  return (
    <div className={styles.indicator} role="img" aria-label={`${total}단계 중 ${step}단계`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index + 1 === step ? styles.active : styles.dot} />
      ))}
    </div>
  )
}
