import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import { createTestVuetify } from '../../test-utils'
import CoinList from '../../views/CoinList.vue'
import CoinListHist from '../../views/CoinListHist.vue'

describe('Router', () => {
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: CoinList },
        { path: '/history', component: CoinListHist }
      ]
    })
  })

  it('should create router instance', () => {
    expect(router).toBeDefined()
  })

  it('should have correct routes', () => {
    const routes = router.getRoutes()
    expect(routes).toHaveLength(2)
    
    const homeRoute = routes.find((route: any) => route.path === '/')
    const historyRoute = routes.find((route: any) => route.path === '/history')
    
    expect(homeRoute).toBeDefined()
    expect(historyRoute).toBeDefined()
  })

  it('should navigate to home route', async () => {
    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('should navigate to history route', async () => {
    await router.push('/history')
    expect(router.currentRoute.value.path).toBe('/history')
  })

  it('should render CoinList component on home route', () => {
    const wrapper = mount(CoinList, {
      global: {
        plugins: [createTestVuetify()]
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })

  it('should render CoinListHist component on history route', () => {
    const wrapper = mount(CoinListHist, {
      global: {
        plugins: [createTestVuetify()]
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })
})
