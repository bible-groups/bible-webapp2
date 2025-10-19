<template>
  <div class="blog-layout min-h-screen flex flex-col">
    <!-- Blog Header -->
    <div class="border-b border-gray-200 bg-white shadow-md">
      <div class="h-[70px] flex items-center px-4 fixed top-0 left-0 right-0 w-full z-50 bg-white">
        <!-- 로고 영역 (좌측) -->
        <div class="flex items-center flex-grow">
          <!-- 모바일 메뉴 버튼 -->
          <button 
            class="xl:hidden mr-2 text-gray-700"
            @click="toggleSidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          
          <!-- 로고 -->
          <h1 class="text-grey-900 no-underline text-2xl font-bold py-3 ml-8">BIBLE BLOG</h1>
        </div>

        <!-- 네비게이션 영역 (중앙) -->
        <nav class="hidden xl:flex flex-grow justify-center">
          <NuxtLink 
            v-for="menu in blogMenus" 
            :key="menu.name" 
            :to="menu.path"
            :class="[
              'font-bold no-underline mx-2 py-2 px-3 rounded-lg transition-all duration-200 relative',
              isCurrentRoute(menu.path) 
                ? 'bg-indigo-400 text-white border-b-2' 
                : 'text-[#555] hover:bg-indigo-50 hover:text-indigo-600'
            ]"
          >
            {{ menu.name }}
          </NuxtLink>

          <NuxtLink 
            to="/main"
            class="font-semibold text-indigo-500 hover:text-indigo-500 ml-2 bg-indigo-50 hover:bg-indigo-200 px-4 py-2 rounded-full"
          >
            개인묵상이동 
          </NuxtLink>
        </nav>

        <!-- 사용자 메뉴 영역 (우측) -->
        <div class="flex items-center flex-grow justify-end text-right">
          <!-- 환영 메시지 -->
          <span class="hidden lg:block text-gray-700 mr-2" v-if="isLoggedIn && user?.displayName">
            {{ user.displayName }} 님, 환영합니다!
          </span>
          
          <!-- 관리자 버튼 -->
          <NuxtLink to="/admin" v-if="isLoggedIn && role === 'admin'" class="text-gray-500 hover:text-red-600 text-xl ml-2 relative top-[-2px]">
            <i class="fa fa-user-circle-o"></i>
          </NuxtLink>
          
          <!-- 사용자 설정 버튼 -->
          <NuxtLink to="/user" v-if="isLoggedIn && role !== 'admin'" class="text-gray-500 hover:text-red-600 text-xl ml-2 relative top-[-2px]">
            <i class="fa fa-user-circle"></i>
          </NuxtLink>
          
          <!-- 로그아웃 버튼 -->
          <button @click="handleLogout" v-if="isLoggedIn" class="text-gray-700 hover:text-red-600 ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
      <!-- 고정 헤더로 인해 가려지는 컨텐츠 보정용 스페이서 -->
      <div class="h-[70px]"></div>
    </div>

    <!-- 메인 콘텐츠 -->
    <main v-if="!needsAuth || (authReady && isLoggedIn)" class="flex-1 container mx-auto py-10 px-4">
      <slot />
    </main>
    <main v-else class="flex-1 container mx-auto py-10 px-4">
      <div class="h-[40vh] flex items-center justify-center text-gray-400">
        <!-- 인증 확인 중 -->
      </div>
    </main>

    <!-- Footer -->
    <div class="footer bg-gray-50">
      <Footer />
    </div>

    <!-- 모바일 사이드바 -->
    <div 
      class="fixed top-0 left-0 z-50 w-64 h-full transition-transform duration-300 ease-in-out transform bg-white shadow-lg xl:hidden"
      :class="{ '-translate-x-full': !isOpen }"
    >
      <div class="p-6 sidebar">
        <div class="text-right close-button xl:hidden">
          <button class="flex-none mobile-button" @click="closeSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h1 class="mb-6 text-2xl font-bold">BIBLE BLOG</h1>
        
        <!-- 사용자 정보 표시 -->
        <div class="mb-6 p-3 bg-gray-200 rounded-lg" v-if="isLoggedIn && user?.displayName">
          <div class="font-medium text-gray-800">
            {{ user.displayName }} 님, 환영합니다!
          </div>
        </div>
        
        <nav class="flex flex-col gap-4">
          <ul>
            <li v-for="menu in blogMenus" :key="menu.name">
              <nuxt-link 
                :to="menu.path" 
                @click="closeSidebar"
                :class="[
                  'block py-2 px-3 rounded-lg transition-all duration-200',
                  isCurrentRoute(menu.path) 
                    ? 'bg-indigo-400 text-white font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                ]"
              >
                {{ menu.name }}
              </nuxt-link>
            </li>
            <!-- 개인묵상이동 메뉴 (모바일용) -->
            <li>
              <nuxt-link 
                to="/main"
                @click="closeSidebar"
                :class="[
                  'block py-2 px-3 rounded-lg transition-all duration-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 font-medium'
                ]"
              >
                개인묵상이동
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- 오버레이 -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-40 bg-black/50"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const isOpen = useSidebar()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// 반응형 데이터 (store에서 가져오기)
const user = computed(() => authStore.currentUser)
const isLoggedIn = computed(() => authStore.isAuthenticated)
const role = computed(() => authStore.currentUserRole)

// 현재 라우트가 보호되는지 여부
const needsAuth = computed(() => {
  const m = route.meta?.middleware
  if (Array.isArray(m)) return m.includes('auth')
  if (typeof m === 'string') return m === 'auth'
  return false
})

// 인증 준비 완료 여부 (플러그인에서 제공)
const { $authReady } = useNuxtApp()
const authReady = ref(false)
onMounted(async () => {
  try {
    await $authReady
  } finally {
    authReady.value = true
  }
})

// 블로그 메뉴 구성
const allBlogMenus = [
  { name: '성서이해', path: '/understand' },
  { name: '성서마당', path: '/forum' },
  { name: '카페신학', path: '/cafe' },
  { name: '신학레시피', path: '/recipe' },
  { name: '말씀새김', path: '/meditation' }
]

// role에 따라 필터링된 메뉴
const blogMenus = computed(() => {
  return allBlogMenus.filter(menu => {
    // 관리자 전용 메뉴
    if (menu.requiresAdmin) {
      return role.value === 'admin'
    }
    // 일반 유저 전용 메뉴 (관리자는 숨김)
    if (menu.hideForAdmin) {
      return role.value !== 'admin'
    }
    return true
  })
})

// 현재 라우트 체크 함수
const isCurrentRoute = (path) => {
  return route.path === path
}

// 사이드바 토글
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false  
}

// 로그아웃 처리
const handleLogout = async () => {
  try {
    await authStore.logout()
    navigateTo('/')
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}
</script>

<style scoped>
/* 블로그 레이아웃 전용 스타일 */
.blog-layout {
  background-color: #f8f9fa;
}
</style>

