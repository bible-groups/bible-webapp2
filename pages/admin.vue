<!-- pages/admin.vue -->
<template>
  <div v-if="canAccess">  <!-- 접근 권한이 있을 때만 렌더링 -->
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <h1 class="mb-4 text-2xl font-bold">관리자 페이지</h1>
          <div class="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-md flex items-center">
            <i class="mdi mdi-account-circle text-blue-500 mr-2"></i>
            <span class="font-bold mr-2">{{ authStore.currentUser?.displayName }}</span>
            관리자님 환영합니다!
          </div>
          <!-- 페이지 내용 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { computed, onMounted } from 'vue'

const authStore = useAuthStore()

// 접근 권한 체크
const canAccess = computed(() => {
  return authStore.authenticated && authStore.currentUser?.role === 'admin'
})

// 컴포넌트 마운트 시 권한 체크
onMounted(() => {
  if (!canAccess.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      fatal: true,  // 오류 발생 시 페이지 종료
      message: '관리자 권한이 필요한 페이지입니다.'
    })
  }
})

definePageMeta({
  middleware: ['auth']
})
</script>