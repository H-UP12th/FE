import { request } from './client'

const base = (menuId) => `/api/menus/${menuId}/questions`

// 질문 목록(최신순): { totalCount, questions: [{ questionId, loginId, content, answerCount, createdAt }] }
export const getQuestions = (menuId, options) => request(base(menuId), options)

// 질문 등록(1,000자 이내) → { questionId, loginId, content, answerCount, createdAt }
export const createQuestion = (menuId, content) =>
  request(base(menuId), { method: 'POST', body: JSON.stringify({ content }) })
