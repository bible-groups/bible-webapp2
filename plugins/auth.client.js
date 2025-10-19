import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    // 1. Pinia store 인스턴스 생성
    const authStore = useAuthStore()
    
    // Firebase 인증 상태 초기화를 위한 Promise 생성
    nuxtApp.provide('authReady', new Promise(async (resolve) => {
      try {
        // 2. Pinia store 초기화 대기
        await authStore.init()  // Firebase 인증 상태 초기화 대기
        console.log('Auth initialization completed')
        // 3. Promise 완료
        resolve(true)
      } catch (error) {
        console.error('Auth initialization failed:', error)
        // 4. 사용자 정보 초기화
        authStore.setUser(null)
        // 5. Promise 완료
        resolve(false)
      } finally {
        // 6. 로딩 상태 초기화
        authStore.loading = false
      }
    }))
  }
})