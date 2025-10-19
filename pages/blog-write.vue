<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <h1 class="text-[1.8rem] xl:text-3xl font-bold text-gray-800 mb-4">블로그 글작성</h1>
        <p class="text-gray-600">블로그 내용을 작성해 보세요!</p>
      </div>

      <!-- 블로그 작성 폼 -->
      <div class="w-full mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">새 블로그 작성</h2>
          
          <form @submit.prevent="addNewBlog" class="space-y-4">
            <!-- 블로그 제목 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input 
                v-model="newBlog.title"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="블로그 제목을 입력하세요"
              >
            </div>
            
            <!-- 블로그 내용 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
              <textarea 
                v-model="newBlog.body"
                required
                rows="8"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="블로그 내용을 입력하세요"
              ></textarea>
            </div>
            
            <!-- 카테고리 선택 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">분류</label>
              <div class="relative">
                <select 
                  v-model="newBlog.category"
                  required
                  class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">카테고리를 선택하세요</option>
                  <option value="성서이해">성서이해</option>
                  <option value="성서마당">성서마당</option>
                  <option value="카페신학">카페신학</option>
                  <option value="신학레시피">신학레시피</option>
                  <option value="말씀새김">말씀새김</option>
                </select>
                <!-- 커스텀 드롭다운 화살표 -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- 버튼 그룹 -->
            <div class="flex justify-center space-x-3 pt-4">
              <button
                type="button"
                @click="goBack"
                class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                :disabled="adding"
                class="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <svg v-if="adding" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>{{ adding ? '작성 중...' : '블로그 추가' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 페이지 메타 설정
definePageMeta({
  layout: 'blog',
  middleware: ['auth']
})

// 새 블로그 작성 관련 변수들
const newBlog = ref({
  title: '',
  body: '',
  category: ''
})
const adding = ref(false)

// 새 블로그 추가 함수
const addNewBlog = async () => {
  try {
    adding.value = true
    
    const { $db } = useNuxtApp()
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    
    const blogsCollection = collection($db, 'blogs')
    
    const docRef = await addDoc(blogsCollection, {
      title: newBlog.value.title,
      body: newBlog.value.body,
      category: newBlog.value.category,
      author: '관리자',
      createdAt: serverTimestamp()
    })
    
    console.log('새 블로그 추가 완료:', docRef.id)
    alert('블로그가 성공적으로 작성되었습니다.')
    
    // 폼 초기화
    newBlog.value = {
      title: '',
      body: '',
      category: ''
    }
    
    // 메인 페이지로 이동
    await navigateTo('/main')
    
  } catch (error) {
    console.error('블로그 추가 실패:', error)
    alert('블로그 작성 중 오류가 발생했습니다.')
  } finally {
    adding.value = false
  }
}

// 취소 버튼 - 메인 페이지로 이동
const goBack = () => {
  navigateTo('/main')
}
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */

/* 1280px 밑에서 안쪽 스크롤바 제거 */
@media (max-width: 1280px) {
  .max-h-screen {
    max-height: none !important;
    overflow-y: visible !important;
  }
}
</style>