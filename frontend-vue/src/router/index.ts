import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import QuestionsView from '../views/QuestionsView.vue'
import QuestionDetailView from '../views/QuestionDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/register',
    },
    {
      path: '/register',
      component: RegisterView,
    },
    {
      path: '/questions',
      component: QuestionsView,
    },
    {
      path: '/questions/:id',
      component: QuestionDetailView,
    },
  ],
})

export default router