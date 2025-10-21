<!-- pages/admin.vue -->
<template>
  <div v-if="canAccess">  <!-- 접근 권한이 있을 때만 렌더링 -->
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <h1 class="text-4xl font-bold text-center mt-10 mb-17">관리자 페이지</h1>
          <div class="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-md ">
            <div class="admin-name">
              <i class="fa fa-user-circle text-blue-500 mr-2"></i>
              <span class="font-bold mr-2">관리자명 : {{ authStore.currentUser?.displayName }}</span>
            </div>
            <div class="admin-email">
              <i class="fa fa-envelope text-blue-500 mr-2"></i>
              <span class="font-bold mr-2">관리자 메일 : {{ authStore.currentUser?.email }}</span>
            </div>
          </div>
          
          <!-- 관리자 정보수정 -->
          <div class="admin-info-edit my-10">
            
            <!-- 비밀번호 재설정 섹션 -->
            <div class="bg-white border border-gray-200 rounded-lg px-6 py-12 shadow-sm">
              <div class="text-center">
                <h2 class="text-2xl font-bold mb-4">관리자 정보수정</h2>
                <p class="text-gray-700 mb-6">관리자정보 수정은 비밀번호만 수정이 가능합니다. 비밀번호를 재설정하시겠습니까?</p>
                
                <button 
                  @click="handlePasswordReset"
                  :disabled="isLoading"
                  class="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
                >
                  <i v-if="isLoading" class="fa fa-spinner fa-spin mr-2"></i>
                  비밀번호 재설정 이메일 보내기
                </button>
              </div>
            </div>
          </div>

          <!-- 유저목록 -->
          <div class="user-list-section mt-10">
            <h2 class="text-2xl font-bold mb-6">일반 유저 목록</h2>
            
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <!-- 테이블 헤더 -->
              <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div class="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div class="col-span-1">번호</div>
                  <div class="col-span-3">이름</div>
                  <div class="col-span-6">이메일</div>
                  <div class="col-span-2 text-right">관리</div>
                </div>
              </div>
              
              <!-- 로딩 상태 -->
              <div v-if="isLoadingUsers" class="p-6 text-center">
                <i class="fa fa-spinner fa-spin text-blue-500 mr-2"></i>
                유저 목록을 불러오는 중...
              </div>
              
              <!-- 유저 목록 -->
              <div v-else-if="users.length > 0" class="divide-y divide-gray-200">
                <div 
                  v-for="(user, index) in sortedUsers" 
                  :key="user.uid"
                  class="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div class="grid grid-cols-12 gap-4 items-center">
                    <div class="col-span-1 text-sm text-gray-600">
                      {{ index + 1 }}
                    </div>
                    <div class="col-span-3 text-sm font-medium text-gray-900">
                      {{ user.name }}
                    </div>
                    <div class="col-span-6 text-sm text-gray-600">
                      {{ user.email }}
                    </div>
                    <div class="col-span-2 text-right space-x-2">
                      <button
                        @click="resetUserPassword(user)"
                        :disabled="isResettingPassword"
                        class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-xs px-3 py-1 rounded transition-colors"
                      >
                        <i v-if="isResettingPassword" class="fa fa-spinner fa-spin mr-1"></i>
                        비밀번호 재설정
                      </button>
                      <button
                        @click="deleteUser(user)"
                        :disabled="isDeletingUser"
                        class="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white text-xs px-3 py-1 rounded transition-colors"
                      >
                        <i v-if="isDeletingUser" class="fa fa-spinner fa-spin mr-1"></i>
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 빈 목록 -->
              <div v-else class="p-6 text-center text-gray-500">
                등록된 일반 유저가 없습니다.
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
const users = ref([])
const isLoadingUsers = ref(false)
const isDeletingUser = ref(false)
const isResettingPassword = ref(false)

// 접근 권한 체크
const canAccess = computed(() => {
  return authStore.authenticated && authStore.currentUser?.role === 'admin'
})

// 이름순으로 정렬된 유저 목록
const sortedUsers = computed(() => {
  return [...users.value].sort((a, b) => {
    return a.name.localeCompare(b.name, 'ko-KR')
  })
})

// 유저 목록 가져오기
const loadUsers = async () => {
  try {
    isLoadingUsers.value = true
    const { $db } = useNuxtApp()
    const { collection, query, where, getDocs } = await import('firebase/firestore')
    
    // 일반 유저만 가져오기 (role이 'user'인 사용자)
    const usersRef = collection($db, 'users')
    const q = query(usersRef, where('role', '==', 'user'))
    const querySnapshot = await getDocs(q)
    
    users.value = querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }))
    
    console.log('유저 목록 로드 완료:', users.value.length + '명')
  } catch (error) {
    console.error('유저 목록 로드 실패:', error)
    alert('유저 목록을 불러오는데 실패했습니다.')
  } finally {
    isLoadingUsers.value = false
  }
}

// 유저 비밀번호 재설정
const resetUserPassword = async (user) => {
  if (!confirm(`"${user.name}" 사용자의 비밀번호를 재설정하시겠습니까?\n\n새 비밀번호는 이메일로 전송됩니다.`)) {
    return
  }
  
  try {
    isResettingPassword.value = true
    console.log('유저 비밀번호 재설정 요청:', user.email)
    
    // Firebase Auth의 sendPasswordResetEmail 사용
    await authStore.resetPassword(user.email)
    
    alert(`"${user.name}" 사용자(${user.email})의 비밀번호 재설정 링크를 발송했습니다.\n\n📧 사용자에게 이메일을 확인하도록 안내해주세요.`)
    console.log('유저 비밀번호 재설정 완료:', user.name)
  } catch (error) {
    console.error('유저 비밀번호 재설정 실패:', error)
    
    let errorMessage = '비밀번호 재설정에 실패했습니다.'
    if (error.code === 'auth/user-not-found') {
      errorMessage = '해당 사용자를 찾을 수 없습니다.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '유효하지 않은 이메일 주소입니다.'
    }
    
    alert(errorMessage + '\n\n에러: ' + error.message)
  } finally {
    isResettingPassword.value = false
  }
}

// 유저 삭제
const deleteUser = async (user) => {
  if (!confirm(`정말로 "${user.name}" 사용자를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
    return
  }
  
  try {
    isDeletingUser.value = true
    const { $db } = useNuxtApp()
    const { doc, deleteDoc } = await import('firebase/firestore')
    
    // Firestore에서 사용자 문서 삭제
    await deleteDoc(doc($db, 'users', user.uid))
    
    // 로컬 목록에서도 제거
    users.value = users.value.filter(u => u.uid !== user.uid)
    
    alert(`"${user.name}" 사용자가 성공적으로 삭제되었습니다.`)
    console.log('유저 삭제 완료:', user.name)
  } catch (error) {
    console.error('유저 삭제 실패:', error)
    alert('사용자 삭제에 실패했습니다: ' + error.message)
  } finally {
    isDeletingUser.value = false
  }
}

// 비밀번호 재설정 이메일 발송
const handlePasswordReset = async () => {
  if (!authStore.currentUser?.email) {
    alert('사용자 이메일 정보를 찾을 수 없습니다.')
    return
  }

  // 이메일 주소 확인을 위한 로그
  console.log('비밀번호 재설정 요청 이메일:', authStore.currentUser.email)
  
  try {
    isLoading.value = true
    await authStore.resetPassword(authStore.currentUser.email)
    
    // 성공 메시지에 이메일 주소 포함
    alert(`비밀번호 재설정 링크를 ${authStore.currentUser.email}로 발송했습니다.\n\n1. 이메일을 확인해주세요.\n2. 스팸 폴더도 확인해주세요.`)
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
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 권한 체크 및 유저 목록 로드
onMounted(async () => {
  if (!canAccess.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      fatal: true,  // 오류 발생 시 페이지 종료
      message: '관리자 권한이 필요한 페이지입니다.'
    })
  }
  
  // 유저 목록 로드
  await loadUsers()
})

definePageMeta({
  middleware: ['auth']
})
</script>