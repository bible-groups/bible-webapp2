import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $authReady } = useNuxtApp()
  const authStore = useAuthStore()

  // 인증 준비 완료 대기
  await $authReady

  // 로딩 중일 때 대기
  if (authStore.loading) {
    return
  }

  // 1. 로그인/회원가입 페이지로 접근 시 처리
  if (['/login', '/signup'].includes(to.path)) {
    if (authStore.authenticated) {
      // 이미 로그인된 상태라면 언제든지 메인으로 이동
      return navigateTo('/main', { replace: true })
    }
    return
  }

  // 2. 기본 인증 체크 (로그인 여부만 확인)
  if (!authStore.authenticated) {
    // 디버깅 시 불필요한 로그를 정리
    nextTick(() => {
      console.clear()
    })
    
    // 로그인 페이지로 리다이렉트
    return navigateTo('/login', {
      replace: true,
      query: {
        redirect: to.fullPath
      }
    })
  }

  // 3. 로그인된 상태에서 인증이 필요하지 않은 공개 페이지로 이동 시 메인으로 이동
  // 공개 페이지 목록을 필요 최소로 지정. (index, about 등 실제 공개 페이지만 추가)
  const publicPages = new Set(['/','/about'])
  if (authStore.authenticated && publicPages.has(to.path)) {
    return navigateTo('/main', { replace: true })
  }
})