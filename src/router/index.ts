import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/qrobot-web/'),
  routes: [
    {
      path: '/',
      redirect: '/init',
      meta: {
        title: '智能问答'
      },
    },
    {
      path: '/init',
      name: 'init',
      component: () => import('../components/HomeView.vue')
    },
  ]
})

export default router
