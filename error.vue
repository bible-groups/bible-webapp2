<!-- error.vue -->
<template>
  <div class="error-page">
    <!-- 배경 오버레이 -->
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <!-- 모달 컨테이너 -->
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md text-center relative">
        <!-- 닫기 버튼 -->
        <button 
          @click="handleNavigation"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- 모달 내용 -->
        <div class="p-8">
          <!-- 아이콘 -->
          <div class="mb-6 flex justify-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center" :class="getIconClass()">
              <svg class="w-10 h-12" :class="getIconColor()" fill="currentColor" viewBox="0 0 24 24">
                <!-- 403 에러인 경우 잠금 아이콘, 그 외는 느낌표 아이콘 -->
                <template v-if="is403Error || error?.statusCode === 403">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </template>
                <template v-else>
                  <path d="M12 5v9" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
                  <circle cx="12" cy="18" r="1.3" fill="currentColor"/>
                </template>
              </svg>
            </div>
          </div>
          
          <!-- 에러 코드 -->
          <h1 class="mb-4 text-2xl font-bold text-gray-900">{{ error?.statusCode || '404' }}</h1>
          
          <!-- 에러 메시지 -->
          <p class="mb-6 text-base xl:text-md text-gray-700">{{ getErrorMessage() }}</p>
          
          <!-- 액션 버튼 -->
          <button
            @click="handleNavigation"
            class="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {{ getButtonText() }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const error = useError()
const authStore = useAuthStore()
const route = useRoute()

// URL 기반으로 403 에러 감지
const is403Error = computed(() => {
  return route.path === '/admin' || route.path === '/user'
})

// 에러 메시지 결정 함수
const getErrorMessage = () => {
  // URL 기반 403 에러 감지 또는 statusCode 기반
  if (is403Error.value || error?.statusCode === 403) {
    return '접근권한이 없습니다!'
  }
  
  // 404 에러인 경우
  if (error?.statusCode === 404) {
    return '페이지를 찾을 수 없습니다.'
  }
  
  // 기타 에러인 경우
  return error?.message || '페이지를 찾을 수 없습니다.'
}

// 버튼 텍스트 결정 함수
const getButtonText = () => {
  // URL 기반 403 에러 감지 또는 statusCode 기반
  if (is403Error.value || error?.statusCode === 403) {
    return '메인으로 가기'
  }
  
  return '홈으로 가기'
}

// 아이콘 배경 클래스 결정 함수
const getIconClass = () => {
  if (is403Error.value || error?.statusCode === 403) {
    return 'bg-red-100'  // 권한 에러는 빨간색 배경
  }
  return 'bg-blue-100'   // 기타 에러는 파란색 배경
}

// 아이콘 색상 클래스 결정 함수
const getIconColor = () => {
  if (is403Error.value || error?.statusCode === 403) {
    return 'text-red-400'  // 권한 에러는 빨간색 아이콘
  }
  return 'text-blue-400'   // 기타 에러는 파란색 아이콘
}

const handleNavigation = async () => {
  try {
    await clearError()
    
    // URL 기반 403 에러 감지 또는 statusCode 기반
    const targetPath = (is403Error.value || error?.statusCode === 403) ? '/main' : '/'
    
    await navigateTo(targetPath, { 
      replace: true,
      immediate: true 
    })
  } catch (e) {
    console.error('Navigation error:', e)
  }
}

// 페이지 제목과 메타 정보를 에러 타입에 따라 동적으로 설정
const getPageTitle = () => {
  if (is403Error.value || error?.statusCode === 403) {
    return '접근권한이 없습니다 | Bible Story'
  }
  return '페이지를 찾을 수 없습니다 | Bible Story'
}

const getPageDescription = () => {
  if (is403Error.value || error?.statusCode === 403) {
    return '접근권한이 없습니다.'
  }
  return '페이지를 찾을 수 없습니다.'
}

useHead({
  title: getPageTitle(),
  meta: [
    { name: 'description', content: getPageDescription() }
  ]
})
</script>

<style scoped>

</style>