<template>
  <div class="flex items-center justify-center h-[75vh]">
    <div class="bg-white p-8 rounded-lg shadow-md w-2/5">
      <div>
        <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">회원가입</h1>        
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">이름</label>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="이름"
            >
          </div>
          <div>
            <label for="email" class="sr-only">이메일</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required
              pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              title="올바른 이메일 주소를 입력해주세요"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="이메일 주소"
            >
          </div>
          <div>
            <label for="password" class="sr-only">비밀번호</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required
              minlength="6"
              title="비밀번호는 6자 이상이어야 합니다"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="비밀번호 (6자 이상)"
            >
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fa fa-user-plus text-indigo-500 group-hover:text-indigo-400" aria-hidden="true"></i>
            </span>
            {{ loading ? '회원가입 중...' : '회원가입' }}
          </button>
        </div>

        <p class="mt-2 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?
          <button @click="switchToLogin" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
            로그인하기
          </button>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const form = ref(null)
const loading = ref(false)

const name = ref('')
const email = ref('')
const password = ref('')

// 폼 유효성 검사 로직 추가
const isValid = computed(() => {
  return name.value.trim() !== '' && 
         email.value.trim() !== '' && 
         password.value.trim() !== '' &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
         password.value.length >= 6
})

const handleSignup = async () => {
  if (!isValid.value) {
    alert('모든 필드를 올바르게 입력해주세요.\n- 이름을 입력해주세요.\n- 올바른 이메일 형식을 입력해주세요.\n- 비밀번호는 6자 이상이어야 합니다.')
    return
  }

  loading.value = true
  try {
    // 이메일 중복 체크
    const emailExists = await authStore.checkEmailExists(email.value.trim())
    if (emailExists) {
      alert('이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.')
      return
    }

    await authStore.handleSignup(email.value.trim(), password.value, name.value.trim())
    alert('회원가입 성공! 로그인 페이지로 이동합니다.')
    router.push('/login')
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      alert('이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.')
    } else {
      alert('회원가입 실패: ' + error.message)
    }
  } finally {
    loading.value = false
  }
}

const reset = () => {
  if (form.value) {
    form.value.reset()
  }
  name.value = ''
  email.value = ''
  password.value = ''
}

const switchToLogin = () => {
  router.push('/login')
}

useHead({
  title: 'GSEED | Signup',
  meta: [
    { name: 'description', content: 'GSEED Signup'}
  ]
})

definePageMeta({
  // 회원가입 페이지는 인증이 필요하지 않음
})
</script>

<style scoped lang="scss">

</style>