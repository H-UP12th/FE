import { useState } from 'react'
import Header from './components/Header'
import BackHeader from './components/BackHeader'
import Button from './components/Button'
import TextField from './components/TextField'
import RecipeItem from './components/RecipeItem'
import Pagination from './components/Pagination'
import PageIndicator from './components/PageIndicator'

// 임시 미리보기 화면: 공통 컴포넌트가 어떻게 생겼는지 확인용
// 라우터(페이지 연결)를 만들면 이 내용은 지우면 돼요
export default function App() {
  const [page, setPage] = useState(1)

  return (
    <>
      <Header />
      <Header showProfile={false} />
      <Header showLogo={false} />
      <BackHeader title="메뉴 상세" />
      <main
        style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '0 30px 40px' }}
      >
        <TextField label="닉네임" placeholder="닉네임" />
        <TextField label="비밀번호" type="password" placeholder="비밀번호" />
        <Button>다음</Button>
        <Button disabled>다음 (비활성)</Button>
        <RecipeItem id={1} name="지중해식 토마토 파스타" />
        <RecipeItem id={2} name="현미볶음밥" />
        <Pagination page={page} totalPages={3} onChange={setPage} />
        <PageIndicator step={2} />
      </main>
    </>
  )
}
