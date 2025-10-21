<template>
  <div class="flex justify-center items-center h-[75vh]">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 class="mb-4 text-center text-2xl font-bold">아이디 찾기</h2>
      
      <div class="mb-10 p-4 bg-blue-100 text-blue-700 rounded">
        Google 계정으로 가입하신 경우, Google 로그인을 이용해주세요.
      </div>

      <form @submit.prevent="handleFindId" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">이름</label>
          <input
            v-model="name"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="이름을 입력해주세요"
          />
        </div>
        
        <button
          type="submit"
          class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :disabled="loading"
        >
          아이디 찾기
        </button>

        <div class="mt-7 text-center">
          <NuxtLink to="/login" class="text-indigo-600 hover:text-indigo-900">
            로그인으로 돌아가기
          </NuxtLink>
        </div>
      </form>
    </div>

    <!-- 결과 모달 -->
    <div v-if="showResult" class="fixed inset-0 flex items-center justify-center bg-black/30 ">
      <div class="bg-white rounded-lg shadow-lg max-w-sm w-full">
        <div class="text-center p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold">아이디 찾기 결과</h3>
        </div>
        <div class="px-4 py-10 text-center">
          <p>찾은 아이디(이메일):</p>
          <p class="mt-2 text-lg font-medium">{{ maskedEmail }}</p>
        </div>
        <div class="flex justify-center p-4 border-t border-gray-200">
          <button
            class="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="closeAndGoToLogin"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const name = ref('')
const loading = ref(false)
const showResult = ref(false)
const maskedEmail = ref('')

const handleFindId = async () => {
  if (!name.value) {
    alert('이름을 입력해주세요.')
    return
  }

  loading.value = true

  try {
    const email = await authStore.findUserId(name.value)
    maskedEmail.value = maskEmail(email)
    showResult.value = true
  } catch (error) {
    alert(error.message || '아이디 찾기에 실패했습니다.')
  } finally {
    loading.value = false
  }
}

const closeAndGoToLogin = () => {
  showResult.value = false
  navigateTo('/login')
}

const maskEmail = (email) => {
  const [username, domain] = email.split('@')
  const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 2)
  return `${maskedUsername}@${domain}`
}

definePageMeta({
  // 아이디 찾기 페이지는 인증이 필요하지 않음
})
</script>

<style scoped>
.v-card {
  max-width: 100%;
  width: 400px;
}
.text-decoration-none {
  color: rgba(0, 0, 0, 0.6);
}

.text-decoration-none:hover {
  color: #4CAF50;
}
</style>