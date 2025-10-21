<template>
  <div class="flex items-start justify-center h-screen px-4 overflow-hidden pt-50">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto border border-gray-200">
      <div>
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Login</h2>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- 이메일 필드 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div class="relative">
            <input 
              v-model="email"
              type="email" 
              placeholder="Enter your email"
              class="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 absolute left-3 top-4 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>

        <!-- 비밀번호 필드 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div class="relative">
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Enter your password"
              class="w-full px-4 py-3 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 absolute left-3 top-4 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <div class="flex gap-3 mt-10">            
          <button 
            type="submit"
            :disabled="loading"
            class="flex-1 bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">로그인 중...</span>
            <span v-else>로그인</span>
          </button>
          <button 
            type="button"
            @click="resetForm"
            class="flex-1 bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors duration-200"
          >
            초기화
          </button>
        </div>
        
        <p class="mt-2 text-center text-sm text-gray-600 flex flex-row justify-center gap-7">
          <button @click="router.push('/')" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
            첫화면으로 이동
          </button> 

          <button @click="switchToSignup" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer ml-3"> 
            회원가입하기
          </button>

          <!-- <button @click="router.push('/find-id')" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">아이디 찾기</button> 
          <button @click="router.push('/find-password')" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">비밀번호 찾기</button>   -->
        </p>

        <!-- <p class="mt-2 text-center text-sm text-gray-600">
          계정이 없으신가요?
          <button @click="switchToSignup" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer ml-3"> 
            회원가입하기
          </button>
        </p> -->
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

// 기본 반응형 변수들
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const email = ref('')
const password = ref('')
const showPassword = ref(false)

// 폼 초기화 함수
const resetForm = () => {
  email.value = ''
  password.value = ''
  showPassword.value = false
}

// Google 클라이언트 ID 
// const config = useRuntimeConfig()

// 구글 클라이언트 ID
// const clientId = config.public.googleSignIn.clientId


// 이메일 로그인 처리 (store 메서드 사용)
const handleLogin = async () => {
  // 기본 유효성 검사
  if (!email.value || !password.value) {
    alert('이메일과 비밀번호를 모두 입력해주세요.')
    return
  }

  // 이메일 형식과 비밀번호 길이 검증
  if (!email.value.includes('@') || password.value.length < 6) {
    alert('올바른 이메일 형식과 6자 이상의 비밀번호를 입력해주세요.')
    return
  }

  loading.value = true
  
  try {
    // store의 handleLogin 메서드 사용
    await authStore.handleLogin(email.value, password.value)
    
    // 로그인 성공
    alert('로그인 성공!')
    
    // redirect 파라미터가 있으면 해당 페이지로, 없으면 main으로 이동
    const route = useRoute()
    const redirectTo = route.query.redirect || '/main'
    await navigateTo(redirectTo)
    
  } catch (error) {
    console.error('로그인 실패:', error)
    
    // 간단한 에러 처리
    let errorMessage = '로그인에 실패했습니다.'
    if (error.code === 'auth/user-not-found') {
      errorMessage = '등록되지 않은 이메일입니다.'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = '잘못된 비밀번호입니다.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '잘못된 이메일 형식입니다.'
    } else if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/invalid-credential') {
      errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.'
    }
    
    alert(errorMessage)
    password.value = '' // 보안상 비밀번호만 초기화
  } finally {
    loading.value = false
  }
}

// 구글 로그인 처리
// const handleGoogleSuccess = async (credential) => {
//   try {
//     await authStore.loginWithGoogle(credential)
//     alert('구글 로그인에 성공했습니다.')
//     router.push('/')
//   } catch (error) {
//     alert('구글 로그인에 실패했습니다: ' + error.message)
//   }
// }

// const handleGoogleError = (error) => {
//   console.error('Google 로그인 오류:', error)
//   alert('구글 로그인 중 오류가 발생했습니다.')
// }

const switchToSignup = () => {
  router.push('/signup')
}

useHead({
  title: 'GSEED | Login',
  meta: [
    { name: 'description', content: 'GSEED Login'}
  ]
})

onMounted(() => {
  console.clear();
})

definePageMeta({
  // 로그인 페이지는 인증이 필요하지 않음
})
</script>

<style scoped lang="scss">

</style>

<style>
/* 로그인 페이지에서 스크롤바 제거 */
html, body {
  overflow: hidden;
  height: 100%;
}
</style>