<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <h1 class="text-[1.8rem] xl:text-3xl font-bold text-gray-800 mb-4">신학레시피</h1>
        <p class="text-gray-600">신학을 요리하듯 쉽고 재미있게 풀어내는 공간입니다.</p>
      </div>

      <!-- 스위칭 버튼 (관리자만 보임) -->
      <div class="flex justify-center mb-6" v-if="role === 'admin'">
        <div class="bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-6 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
              viewMode === 'list' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            신학레시피 목록
          </button>
          <button
            @click="viewMode = 'add'"
            :class="[
              'px-6 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
              viewMode === 'add' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            신학레시피 작성
          </button>
        </div>
      </div>

      <!-- 검색 영역 -->
      <div class="max-w-6xl mx-auto mb-8">
        <div class="flex gap-3">
          <div class="relative flex-1">
            <input 
              v-model="searchTerm"
              type="text" 
              placeholder="글 내용을 검색하세요..."
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <div class="w-5 h-5 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <button
            @click="clearFilters"
            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            초기화
          </button>
        </div>
      </div>

      <!-- 글 작성 폼 (관리자만) -->
      <div v-if="viewMode === 'add'" class="max-w-6xl mx-auto mb-8 border border-gray-200 rounded-lg">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">새 글 작성</h2>
          
          <form @submit.prevent="addNewPost" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input 
                v-model="newPost.title"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="제목을 입력하세요"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">본문 내용</label>
              <textarea 
                v-model="newPost.body"
                required
                rows="10"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="본문 내용을 입력하세요"
              ></textarea>
            </div>
            
            <div class="flex justify-center space-x-3 pt-4">              
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
                <span>{{ adding ? '작성 중...' : '글 작성' }}</span>
              </button>
              <button
                type="button"
                @click="viewMode = 'list'"
                class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="text-center py-12">
        <div class="flex flex-col items-center justify-center">
          <div class="w-32 h-px bg-gray-300 mb-8"></div>
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- 글 목록 -->
      <div v-else-if="viewMode === 'list'" class="max-w-6xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div
          v-for="(post, index) in filteredPosts"
          :key="post.id"
          :class="[
            'border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
            index === filteredPosts.length - 1 ? 'border-b-0' : ''
          ]"
          @click="openModal(post)"
        >
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 mt-1">
                <div class="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center">
                  <i class="fa fa-file-text-o text-white text-lg fa-fw"></i>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-md xl:text-lg font-semibold text-gray-900 truncate">
                    {{ post.title }}
                  </h3>
                  <div class="flex items-center space-x-2 ml-4">
                    <span class="text-sm text-gray-500">{{ post.createdAt }}</span>
                    <span class="text-sm text-gray-400 hidden sm:block">{{ post.author }}</span>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ post.body }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {{ post.category }}
                    </span>
                  </div>
                  
                  <button 
                    class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
                    @click.stop="openModal(post)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span>자세히</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="allFilteredPosts.length > 0" class="max-w-6xl mx-auto flex justify-center mt-8">
        <nav class="flex items-center space-x-1">
          <button :disabled="currentGroup <= 1" @click="goToPrevGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentPage === page ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">
            {{ page }}
          </button>
          <button :disabled="currentGroup >= totalGroups" @click="goToNextGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup >= totalGroups ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </nav>
      </div>

      <!-- 데이터가 없을 때 -->
      <div v-if="!loading && allFilteredPosts.length === 0" class="max-w-6xl mx-auto text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.515-.751-6.281-2.02M12 15c2.34 0 4.515-.751 6.281-2.02M12 3v12"></path>
          </svg>
        </div>
        <p class="text-gray-500 mb-4">
          {{ searchTerm ? '검색 조건에 맞는 글이 없습니다.' : '등록된 글이 없습니다.' }}
        </p>
        <button 
          v-if="searchTerm"
          @click="clearFilters"
          class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          검색 초기화
        </button>
      </div>
    </div>

    <!-- 글 상세 모달 -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full lg:w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-end mb-4">
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="text-center mb-5">
            <input 
              v-if="role === 'admin'"
              v-model="editTitle"
              class="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50 text-center"
              placeholder="제목을 입력하세요"
            >
            <h2 
              v-else
              class="w-full text-2xl font-bold text-gray-800"
            >
              {{ selectedPost.title }}
            </h2>
          </div>
        </div>

        <div class="px-6 py-12 overflow-y-auto" style="height: 60vh;">
          <div>
            <label class="block text-base font-bold text-gray-700 mb-2 sr-only">본문 내용</label>
            <textarea 
              v-if="role === 'admin'"
              v-model="editBody"
              :rows="calculateRows(editBody)"
              class="w-full text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50"
              placeholder="본문 내용을 입력하세요"
            ></textarea>
            <div 
              v-else
              class="w-full px-4 py-3 text-gray-700 leading-relaxed whitespace-pre-wrap"
            >
              {{ selectedPost.body }}
            </div>
          </div>   
        </div>

        <div class="p-6 border-t border-gray-200">
          <!-- <div class="mb-10">
            <div class="flex flex-wrap gap-3 justify-center">               
              <div class="bg-gray-100 text-gray-800 px-15 py-2 rounded-full text-sm font-medium">
                <input 
                  v-if="role === 'admin'"
                  v-model="editAuthor"
                  class="bg-transparent border-none outline-none focus:bg-gray-200 focus:px-2 focus:py-2 focus:rounded-lg transition-all duration-200 hover:bg-gray-200 text-center min-w-0"
                  placeholder="관리자"
                >
                <span v-else>{{ selectedPost.author }}</span>
              </div>
            </div>
          </div> -->

          <div class="flex justify-center space-x-4 py-7">
            <button
              v-if="role === 'admin'" 
              @click="updatePost"
              :disabled="updating"
              class="w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center sm:space-x-2 cursor-pointer"
            >
              <svg v-if="updating" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span class="hidden sm:inline sm:ml-2">{{ updating ? '수정 중...' : '수정' }}</span>
            </button>
            
            <button 
              v-if="role === 'admin'" 
              @click="deletePost"
              :disabled="deleting"
              class="w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center sm:space-x-2 cursor-pointer"
            >
              <svg v-if="deleting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span class="hidden sm:inline sm:ml-2">{{ deleting ? '삭제 중...' : '삭제' }}</span>
            </button>
            
            <button
              @click="closeModal"
              class="w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center sm:space-x-2 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span class="hidden sm:inline sm:ml-2">창닫기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'blog',
    middleware: ['auth']
  })

import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)
const role = computed(() => authStore.currentUserRole)

const searchTerm = ref('')
const viewMode = ref('list')
const modalOpen = ref(false)
const selectedPost = ref({})
const editTitle = ref('')
const editBody = ref('')
const editAuthor = ref('')
const updating = ref(false)
const deleting = ref(false)
const newPost = ref({ title: '', body: '' })
const adding = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const posts = ref([])
const loading = ref(true)

const formatFirebaseDate = (timestamp) => {
  try {
    if (!timestamp) return ''
    let date
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate()
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000)
    } else if (typeof timestamp === 'string') {
      return timestamp
    } else {
      date = new Date(timestamp)
    }
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('날짜 변환 오류:', error)
    return '날짜 오류'
  }
}

onMounted(async () => {
  console.log('[PAGE] recipe mounted')
  await loadPostsFromFirebase()
})

const loadPostsFromFirebase = async () => {
  try {
    loading.value = true
    const { $db } = useNuxtApp()
    const { collection, getDocs, query, where, orderBy } = await import('firebase/firestore')
    const blogsCollection = collection($db, 'blogs')
    const q = query(blogsCollection, where('category', '==', '신학레시피'), orderBy('createAt', 'desc'))
    const querySnapshot = await getDocs(q)
    posts.value = querySnapshot.docs.map(doc => {
      const data = doc.data()
      let authorName = data.author || '관리자'
      if (authorName.includes('@')) authorName = '관리자'
      return {
        id: doc.id,
        title: data.title || '',
        body: data.body || '',
        author: authorName,
        category: data.category || '',
        createdAt: formatFirebaseDate(data.createdAt || data.createAt)
      }
    })
    console.log('Firebase에서 신학레시피 데이터 로드 완료:', posts.value.length, '개')
  } catch (error) {
    console.error('글 데이터 로드 실패:', error)
    posts.value = []
  } finally {
    loading.value = false
  }
}

const allFilteredPosts = computed(() => {
  let filtered = posts.value
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase().trim()
    filtered = filtered.filter(post => 
      (post.title && post.title.toLowerCase().includes(search)) ||
      (post.body && post.body.toLowerCase().includes(search)) ||
      (post.author && post.author.toLowerCase().includes(search))
    )
  }
  return filtered
})

const pagesPerGroup = ref(10)
const totalPages = computed(() => Math.ceil(allFilteredPosts.value.length / itemsPerPage.value))
const totalGroups = computed(() => Math.ceil(totalPages.value / pagesPerGroup.value))
const currentGroup = ref(1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

const filteredPosts = computed(() => {
  return allFilteredPosts.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = (currentGroup.value - 1) * pagesPerGroup.value + 1
  const end = Math.min(currentGroup.value * pagesPerGroup.value, totalPages.value)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const openModal = (post) => {
  selectedPost.value = post
  editTitle.value = post.title
  editBody.value = post.body
  editAuthor.value = post.author
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  selectedPost.value = {}
  editTitle.value = ''
  editBody.value = ''
  editAuthor.value = ''
  updating.value = false
  deleting.value = false
}

const calculateRows = (text) => {
  if (!text) return 3
  const lines = text.split('\n')
  let totalRows = lines.length
  for (let line of lines) {
    totalRows += Math.floor(line.length / 80)
  }
  return Math.max(3, totalRows)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    currentGroup.value = Math.ceil(page / pagesPerGroup.value)
  }
}

const goToNextGroup = () => {
  if (currentGroup.value < totalGroups.value) {
    currentGroup.value++
    currentPage.value = (currentGroup.value - 1) * pagesPerGroup.value + 1
  }
}

const goToPrevGroup = () => {
  if (currentGroup.value > 1) {
    currentGroup.value--
    currentPage.value = (currentGroup.value - 1) * pagesPerGroup.value + 1
  }
}

const refreshData = async () => {
  await loadPostsFromFirebase()
  currentPage.value = 1
}

const clearFilters = () => {
  searchTerm.value = ''
  currentPage.value = 1
}

const updatePost = async () => {
  if (!selectedPost.value.id) return
  try {
    updating.value = true
    const { $db } = useNuxtApp()
    const { doc, updateDoc } = await import('firebase/firestore')
    const postDoc = doc($db, 'blogs', selectedPost.value.id)
    await updateDoc(postDoc, {
      title: editTitle.value,
      body: editBody.value,
      author: editAuthor.value
    })
    const postIndex = posts.value.findIndex(post => post.id === selectedPost.value.id)
    if (postIndex !== -1) {
      posts.value[postIndex] = {
        ...posts.value[postIndex],
        title: editTitle.value,
        body: editBody.value,
        author: editAuthor.value
      }
    }
    selectedPost.value = {
      ...selectedPost.value,
      title: editTitle.value,
      body: editBody.value,
      author: editAuthor.value
    }
    alert('글이 성공적으로 수정되었습니다.')
  } catch (error) {
    console.error('글 수정 실패:', error)
    alert('글 수정 중 오류가 발생했습니다.')
  } finally {
    updating.value = false
  }
}

const deletePost = async () => {
  if (!selectedPost.value.id) return
  if (!confirm('정말로 이 글을 삭제하시겠습니까?')) return
  try {
    deleting.value = true
    const { $db } = useNuxtApp()
    const { doc, deleteDoc } = await import('firebase/firestore')
    const postDoc = doc($db, 'blogs', selectedPost.value.id)
    await deleteDoc(postDoc)
    posts.value = posts.value.filter(post => post.id !== selectedPost.value.id)
    alert('글이 성공적으로 삭제되었습니다.')
    closeModal()
  } catch (error) {
    console.error('글 삭제 실패:', error)
    alert('글 삭제 중 오류가 발생했습니다.')
  } finally {
    deleting.value = false
  }
}

const addNewPost = async () => {
  try {
    adding.value = true
    const { $db } = useNuxtApp()
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    const blogsCollection = collection($db, 'blogs')
    const docRef = await addDoc(blogsCollection, {
      title: newPost.value.title,
      body: newPost.value.body,
      category: '신학레시피',
      author: '관리자',
      createAt: serverTimestamp()
    })
    const newPostData = {
      id: docRef.id,
      title: newPost.value.title,
      body: newPost.value.body,
      category: '신학레시피',
      author: '관리자',
      createdAt: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    posts.value.unshift(newPostData)
    newPost.value = { title: '', body: '' }
    viewMode.value = 'list'
    alert('글이 성공적으로 작성되었습니다.')
  } catch (error) {
    console.error('글 추가 실패:', error)
    alert('글 작성 중 오류가 발생했습니다.')
  } finally {
    adding.value = false
  }
}

watch([searchTerm], () => {
  currentPage.value = 1
  })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1280px) {
  .max-h-screen {
    max-height: none !important;
    overflow-y: visible !important;
  }
}
</style>
