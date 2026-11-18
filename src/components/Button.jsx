import styles from './Button.module.css'

// 초록 버튼 (가로 꽉 채움)
// 사용법: <Button onClick={...}>다음</Button>
//         <Button disabled>다음</Button>      → 흐리게, 클릭 안 됨
//         <Button type="submit">로그인</Button> → form 안에서 제출
export default function Button({ children, ...props }) {
  return (
    <button type="button" className={styles.button} {...props}>
      {children}
    </button>
  )
}
