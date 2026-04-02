import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import QuestionsView from '../views/QuestionsView.vue'
import QuestionDetailView from '../views/QuestionDetailView.vue'
import ForgotPasswordView from "../views/ForgotPasswordView.vue"
import ChangePasswordView from "../views/ChangePasswordView.vue"
import ForgotPasswordSentView from "../views/ForgotPasswordSentView.vue"

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
    {
  path: "/forgot-password",
  name: "forgot-password",
  component: ForgotPasswordView,
},

{
  path: "/forgot-password/sent",
  name: "forgot-password-sent",
  component: ForgotPasswordSentView,
},

{
  path: "/change-password",
  name: "change-password",
  component: ChangePasswordView,
},
  ],
})

export default router