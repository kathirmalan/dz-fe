import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../pages/FAQPage.vue'),
      meta: { title: 'FAQ - Drivers Zone' }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../pages/ContactPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
      name: 'matchall'
    }
  ]
})


router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'DriversZone'
  next()
})

export default router
