<template>
  <div class="flex justify-center items-center h-[75vh]">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
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
  try {
    await authStore.resetPassword(email.value)
    alert('비밀번호 재설정 링크를 이메일로 발송했습니다.')
  } catch (error) {
    alert('비밀번호 재설정 이메일 발송에 실패했습니다: ' + error.message)
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
