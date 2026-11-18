import styles from './TextField.module.css'

// 라벨 + 입력칸 (회원가입·로그인·프로필 수정·레시피 작성에서 사용)
// 사용법: <TextField label="닉네임" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
//         비밀번호는 type="password" 추가
export default function TextField({ label, ...props }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} {...props} />
    </label>
  )
}
