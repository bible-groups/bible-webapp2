<!-- pages/user.vue -->
<template>
  <div v-if="canAccess">  <!-- 접근 권한이 있을 때만 렌더링 -->
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <h1 class="text-4xl font-bold text-center mt-10 mb-17">마이페이지</h1>
          <div class="mb-4 p-4 bg-green-100 border border-green-300 rounded-md">
            <div class="admin-name">
              <i class="fa fa-user-circle text-blue-500 mr-2"></i>
              <span class="font-bold mr-2">사용자명 : {{ authStore.currentUser?.displayName }}</span>
            </div>
            <div class="admin-email">
              <i class="fa fa-envelope text-blue-500 mr-2"></i>
              <span class="font-bold mr-2">사용자 메일 : {{ authStore.currentUser?.email }}</span>
            </div>
          </div>
          
          <!-- 비밀번호 재설정 섹션 -->
          <div class="password-reset-section mt-8">
            <h2 class="text-xl font-bold mb-4">비밀번호 변경</h2>
            
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div class="text-center">
                <p class="text-gray-700 mb-6">비밀번호를 변경하시겠습니까?<br>변경 링크가 아래 이메일로 발송됩니다. (스팸 폴더도 확인해주세요!)</p>
                
                <div class="mb-4">
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div class="flex items-center justify-center">
                      <i class="fa fa-envelope text-blue-500 mr-2"></i>
                      <span class="text-sm font-medium text-blue-700">
                        발송될 이메일: {{ authStore.currentUser?.email }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  @click="handlePasswordReset"
                  :disabled="isLoading"
                  class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
                >
                  <i v-if="isLoading" class="fa fa-spinner fa-spin mr-2"></i>
                  비밀번호 재설정 이메일 보내기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { computed, onMounted, ref } from 'vue'

const authStore = useAuthStore()
const isLoading = ref(false)

// 접근 권한 체크
const canAccess = computed(() => {
  return authStore.authenticated && authStore.currentUser?.role === 'user'
})

// 비밀번호 재설정 이메일 발송
const handlePasswordReset = async () => {
  if (!authStore.currentUser?.email) {
    alert('사용자 이메일 정보를 찾을 수 없습니다.')
    return
  }

  if (!confirm(`비밀번호 재설정 이메일을 ${authStore.currentUser.email}로 발송하시겠습니까?`)) {
    return
  }

  try {
    isLoading.value = true
    console.log('사용자 비밀번호 재설정 요청:', authStore.currentUser.email)
    
    await authStore.resetPassword(authStore.currentUser.email)
    
    alert(`비밀번호 재설정 링크를 ${authStore.currentUser.email}로 발송했습니다.\n\n1. 이메일을 확인해주세요.\n2. 스팸 폴더도 확인해주세요.`)
    console.log('사용자 비밀번호 재설정 완료')
  } catch (error) {
    console.error('비밀번호 재설정 이메일 발송 실패:', error)
    console.error('에러 상세:', error.code, error.message)
    
    // 에러 코드별 메시지
    let errorMessage = '비밀번호 재설정 이메일 발송에 실패했습니다.'
    if (error.code === 'auth/user-not-found') {
      errorMessage = '사용자 정보를 찾을 수 없습니다.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '유효하지 않은 이메일 주소입니다.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
    }
    
    alert(errorMessage + '\n\n에러 코드: ' + error.code)
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 권한 체크
onMounted(() => {
  if (!canAccess.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      fatal: true,  // 오류 발생 시 페이지 종료
      message: '일반 사용자 권한이 필요한 페이지입니다.'
    })
  }
})

definePageMeta({
  middleware: ['auth']
})
</script>