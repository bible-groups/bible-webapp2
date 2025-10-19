import { useAuthStore } from '~/stores/auth'

// 전역 미들웨어: 로그인된 상태에서 공개 페이지 접근시 메인으로 리다이렉트
export default defineNuxtRouteMiddleware(async (to) => {
  const { $authReady } = useNuxtApp()
  const authStore = useAuthStore()

  // Firebase auth 초기화 대기
  await $authReady

  if (authStore.loading) return

  // 공개 페이지 목록: 로그인/회원가입/루트 등 인증 불필요 페이지
  const publicPages = new Set(['/', '/login', '/signup'])

  if (authStore.authenticated && publicPages.has(to.path)) {
    return navigateTo('/main', { replace: true })
  }
})


