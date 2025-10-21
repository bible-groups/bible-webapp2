<template>
  <div class="flex justify-center items-center h-[75vh]">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 class="mb-4 text-center text-2xl font-bold">비밀번호 찾기</h2>
      <form @submit.prevent="handleFindPassword" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">이메일</label>
        <input
          v-model="email"
          type="email"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="이메일을 입력해주세요"
        />
      </div>
      
      <button
        type="submit"
        class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        비밀번호 재설정 링크 받기
      </button>

      <div class="mt-4 text-center">
        <NuxtLink to="/login" class="text-indigo-600 hover:text-indigo-900">
          로그인으로 돌아가기
        </NuxtLink>
      </div>
    </form>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const email = ref('')

const handleFindPassword = async () => {
  // 이메일 유효성 검사
  if (!email.value || !email.value.includes('@')) {
    alert('올바른 이메일 주소를 입력해주세요.')
    return
  }

  try {
    console.log('=== 비밀번호 재설정 요청 시작 ===')
    console.log('요청 이메일:', email.value)
    
    // 사용자 존재 여부 확인
    console.log('사용자 존재 여부 확인 중...')
    const userExists = await authStore.checkEmailExists(email.value)
    console.log('사용자 존재 여부:', userExists)
    
    if (!userExists) {
      alert('해당 이메일로 등록된 사용자를 찾을 수 없습니다.\n\n다른 이메일 주소를 입력하거나 회원가입을 진행해주세요.')
      return
    }
    
    console.log('Firebase Auth 인스턴스:', authStore)
    
    await authStore.resetPassword(email.value)
    
    console.log('=== 비밀번호 재설정 요청 성공 ===')
    alert(`비밀번호 재설정 링크를 ${email.value}로 발송했습니다.\n\n📧 이메일을 확인해주세요.\n📁 스팸 폴더도 확인해주세요.`)
  } catch (error) {
    console.error('비밀번호 재설정 이메일 발송 실패:', error)
    console.error('에러 상세:', error.code, error.message)
    
    // 에러 코드별 메시지
    let errorMessage = '비밀번호 재설정 이메일 발송에 실패했습니다.'
    if (error.code === 'auth/user-not-found') {
      errorMessage = '해당 이메일로 등록된 사용자를 찾을 수 없습니다.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '유효하지 않은 이메일 주소입니다.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
    }
    
    alert(errorMessage + '\n\n에러 코드: ' + error.code)
  }
}

definePageMeta({
  // 비밀번호 찾기 페이지는 인증이 필요하지 않음
})
</script>

<style scoped>
.text-decoration-none {
  color: rgba(0, 0, 0, 0.6);
}

.text-decoration-none:hover {
  color: #4CAF50;
}
</style>
