import { createRouter, createWebHistory } from 'vue-router'
import CoinList from '../views/CoinList.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CoinList,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CoinListHist.vue'),
    },
  ],
})

export default router
