<template>
  <!-- App Bar : Header Area -->
  <div class="bg-white shadow-md h-[70px] flex items-center px-4 fixed top-0 left-0 right-0 w-full z-50" v-if="currentView !== 'IntroView'">

    <!-- 로고 영역 (좌측) -->
    <div class="flex items-center flex-grow">
      <!-- 모바일 메뉴 버튼 -->
      <button 
        class="xl:hidden mr-2 text-gray-700"
        @click="toggleSidebar"
        v-if="isLoggedIn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      
      <!-- 로고 -->
      <h1 class="text-grey-900 no-underline text-2xl font-bold py-3 ml-8">BIBLE STORY</h1>
    </div>

    <!-- 네비게이션 영역 (중앙) -->
    <nav class="hidden xl:flex flex-grow justify-center">
      <template v-if="isLoggedIn">
        <NuxtLink 
          v-for="menu in menus" 
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
          v-if="role === 'admin'"
          to="/blog-write"
          class="font-semibold text-indigo-500 hover:text-indigo-500 ml-2 bg-indigo-50 hover:bg-indigo-200 px-4 py-2 rounded-full"
        >
          블로그작성
        </NuxtLink>
      </template>
    </nav>

    <!-- 사용자 메뉴 영역 (우측) -->
    <div class="flex items-center flex-grow justify-end text-right">
      <!-- 환영 메시지 -->
      <span class="hidden lg:block text-gray-700 mr-2" v-if="isLoggedIn && user?.displayName">
        {{ user.displayName }} 님, 환영합니다!
      </span>
      
      <!-- 홈 버튼 (로그인시) -->
      <!-- <NuxtLink to="/main" class="ml-4 text-gray-700 hover:text-indigo-600" v-if="isLoggedIn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </NuxtLink> -->
      
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
  <div class="h-[70px]" v-if="currentView !== 'IntroView'"></div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const route = useRoute()
const isOpen = useSidebar()
const authStore = useAuthStore()

// 반응형 데이터 (store에서 가져오기)
const user = computed(() => {
  const currentUser = authStore.currentUser
  // console.log('Header - current user:', currentUser)
  return currentUser
})
const isLoggedIn = computed(() => authStore.isAuthenticated)
const role = computed(() => {
  const userRole = authStore.currentUserRole
  // console.log('Header - current role:', userRole)
  return userRole
})
const currentView = ref('')

// 디버깅용 - 사용자 정보 변화 감지
watch([user, role], ([newUser, newRole]) => {
  // console.log('🔵 Header - 사용자 정보 변경:', { 
  //   displayName: newUser?.displayName, 
  //   email: newUser?.email,
  //   role: newRole,
  //   fullUser: newUser 
  // })
}, { immediate: true })

// 메뉴 구성 
const allMenus = [
  { name: '홈', path: '/main', active: false },
  { name: '개인묵상', path: '/qt', active: false },
  { name: '묵상공유', path: '/share', active: false},
  { name: '성경개요', path: '/overview', active: false },
  { name: '호크마', path: '/hokma', active: false },
  { name: '신학철학개념', path: '/concepts', active: false },
  { name: '인문학', path: '/humanities', active: false },
]

// role에 따라 필터링된 메뉴
const menus = computed(() => {
  return allMenus.filter(menu => {
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

// 로그아웃 처리 (store 메서드 사용)
const handleLogout = async () => {
  try {
    await authStore.logout()
    // 로그아웃 후 메인 페이지로 이동
    navigateTo('/')
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}
</script>