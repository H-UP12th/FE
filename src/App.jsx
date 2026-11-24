import { Navigate, Route, Routes } from 'react-router-dom'
import Intro from './pages/Intro'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Main from './pages/Main'
import MenuList from './pages/MenuList'
import MenuDetail from './pages/MenuDetail'
import RecipeCreate from './pages/RecipeCreate'
import QuestionList from './pages/QuestionList'
import QuestionDetail from './pages/QuestionDetail'
import AnswerWrite from './pages/AnswerWrite'
import ToBuy from './pages/ToBuy'
import Memo from './pages/Memo'
import MyPage from './pages/MyPage'
import ProfileEdit from './pages/ProfileEdit'
import MyRecipes from './pages/MyRecipes'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/start" element={<Intro />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding/:step" element={<Onboarding />} />
      <Route path="/menus" element={<MenuList />} />
      <Route path="/menus/new" element={<RecipeCreate />} />
      <Route path="/menus/:menuId" element={<MenuDetail />} />
      <Route path="/menus/:menuId/questions" element={<QuestionList />} />
      <Route path="/menus/:menuId/questions/:questionId" element={<QuestionDetail />} />
      <Route path="/menus/:menuId/questions/:questionId/answer" element={<AnswerWrite />} />
      <Route path="/to-buy" element={<ToBuy />} />
      <Route path="/memo" element={<Memo />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/edit" element={<ProfileEdit />} />
      <Route path="/mypage/bookmarks" element={<MyRecipes key="bookmarks" kind="bookmarks" />} />
      <Route path="/mypage/menus" element={<MyRecipes key="menus" kind="menus" />} />
      <Route path="/mypage/recent" element={<MyRecipes key="recent" kind="recent" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
