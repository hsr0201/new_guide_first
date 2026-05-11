import { createRouter, createWebHistory } from 'vue-router'
import GuideLibraryFromFigma from '../pages/GuideLibraryFromFigma.vue'
import PaymentEstimatePage from '../pages/PaymentEstimatePage.vue'

/** 应用路由：首页为向导库，支付预估价为独立整页（Figma 3827:68996 语境 + 右侧 3827:69137） */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'guide-library', component: GuideLibraryFromFigma },
    {
      path: '/payment-estimate',
      name: 'payment-estimate',
      component: PaymentEstimatePage,
    },
  ],
})

export default router
