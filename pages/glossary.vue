<template>
  <div class="min-h-screen">
    <div class="container mx-auto py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <h1 class="text-[1.8rem] xl:text-3xl font-bold text-gray-800 mb-4">용어 사전</h1>
        <p class="text-gray-600">성경과 관련된 다양한 용어들을 찾아보세요</p>
      </div>

      <!-- 스위칭 버튼 -->
      <div class="flex justify-center mb-6" v-if="role === 'admin'">
        <div class="bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-6 py-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'list' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            용어 목록
          </button>
          <button
            @click="viewMode = 'add'"
            :class="[
              'px-6 py-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'add' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            용어 추가
          </button>
        </div>
      </div>

      <!-- 검색 및 필터 영역 -->
      <div class="w-full lg:max-w-6xl lg:mx-auto mb-8">
        <div class="flex flex-col xl:flex-row gap-4">
          <!-- 검색창 -->
          <div class="flex-1 relative">
            <input 
              v-model="searchTerm"
              type="text" 
              placeholder="용어를 검색하세요..."
              class="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
              <button
                @click="refreshData"
                :disabled="loading"
                class="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                title="새로고침"
              >
                <svg 
                  :class="['w-4 h-4', loading ? 'animate-spin' : '']" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
              <div class="w-5 h-5 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- 카테고리 필터 -->
          <div class="flex flex-wrap gap-2 justify-center lg:justify-center">
            <button
              v-for="category in displayCategories"
              :key="category"
              @click="selectedCategory = category"
              :class="[
                'px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                selectedCategory === category 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ category }}
            </button>
          </div>

        </div>
          <p class="text-sm text-gray-500 mt-8 text-center">* 카테고리 등록 및 검색은 6개로 분류된 항목만 가능합니다. (구약, 신약, 신학, 역사, 지명, 인명)</p>
      </div>

      <!-- 용어 추가 폼 -->
      <div v-if="viewMode === 'add'" class="w-full lg:max-w-6xl lg:mx-auto mb-8 border border-gray-200 rounded-lg">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">새 용어 추가</h2>
          
          <form @submit.prevent="addNewTerm" class="space-y-4">
            <!-- 용어 제목 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">용어 제목</label>
              <input 
                v-model="newTerm.title"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="용어 제목을 입력하세요"
              >
            </div>
            
            <!-- 용어 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">용어 설명</label>
              <textarea 
                v-model="newTerm.body"
                required
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="용어 설명을 입력하세요"
              ></textarea>
            </div>
            
            <!-- 카테고리와 참고 구절 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                <div class="relative">
                  <select 
                    v-model="newTerm.category"
                    required
                    class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">카테고리를 선택하세요</option>
                    <option value="구약">구약</option>
                    <option value="신약">신약</option>
                    <option value="신학">신학</option>
                    <option value="역사">역사</option>
                    <option value="지명">지명</option>
                    <option value="인명">인명</option>
                  </select>
                  <!-- 커스텀 드롭다운 화살표 -->
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">참고 구절</label>
                <input 
                  v-model="newTerm.reference"
                  type="text" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="예: 요한복음 3:16"
                >
              </div>
            </div>
            
            <!-- 버튼 그룹 -->
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
                <span>{{ adding ? '추가 중...' : '용어 추가' }}</span>
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
          <!-- 상단 구분선 -->
          <div class="w-32 h-px bg-gray-300 mb-8"></div>
          
          <!-- 중앙 아이콘 -->
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- 용어 목록 (리스트 형식) -->
      <div v-else-if="viewMode === 'list'" class="w-full lg:max-w-6xl lg:mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div
          v-for="(term, index) in filteredTerms"
          :key="term.id"
          :class="[
            'border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
            index === filteredTerms.length - 1 ? 'border-b-0' : ''
          ]"
          @click="openModal(term)"
        >
          <div class="p-6">
            <!-- 메인 내용 -->
            <div class="flex items-start space-x-4">
              <!-- 아이콘 -->
              <div class="flex-shrink-0 mt-1">
                <div class="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center">
                  <i class="fa fa-file-text-o text-white text-lg fa-fw"></i>
                </div>
              </div>
              
              <!-- 내용 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-md xl:text-lg font-semibold text-gray-900 truncate">
                    {{ term.title }}
                  </h3>
                  <div class="flex items-center space-x-2 ml-4">
                    <span class="text-sm text-gray-500">{{ term.createdAt }}</span>
                    <span class="text-sm text-gray-400 hidden sm:block">{{ term.author }}</span>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ term.body }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {{ term.category }}
                    </span>
                    <span class="text-sm text-gray-500">
                      {{ term.reference }}
                    </span>
                  </div>
                  
                  <button 
                    class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
                    @click.stop="openModal(term)"
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
      <div v-if="allFilteredTerms.length > 0" class="w-full lg:max-w-6xl lg:mx-auto flex justify-center mt-8">
        <nav class="flex items-center space-x-1">
          <!-- 이전 10개 그룹 이동 -->
          <button
            :disabled="currentGroup <= 1"
            @click="goToPrevGroup"
            :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <!-- 페이지 번호들 (현재 그룹) -->
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentPage === page ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">
            {{ page }}
          </button>

          <!-- 다음 10개 그룹 이동 -->
          <button
            :disabled="currentGroup >= totalGroups"
            @click="goToNextGroup"
            :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup >= totalGroups ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </nav>
      </div>

      <!-- 데이터가 없을 때 -->
      <div v-if="!loading && allFilteredTerms.length === 0" class="w-full lg:max-w-6xl lg:mx-auto text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.515-.751-6.281-2.02M12 15c2.34 0 4.515-.751 6.281-2.02M12 3v12"></path>
          </svg>
        </div>
        <p class="text-gray-500 mb-4">
          {{ searchTerm || selectedCategory !== '전체' ? '검색 조건에 맞는 용어가 없습니다.' : '등록된 용어가 없습니다.' }}
        </p>
        <button 
          v-if="searchTerm || selectedCategory !== '전체'"
          @click="clearFilters"
          class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          필터 초기화
        </button>
      </div>
    </div>

    <!-- 용어 상세 모달 -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full lg:w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- 모달 헤더 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <div class="flex-1 pr-4">
            <!-- 제목 (편집 가능) -->
            <input 
              v-model="editTitle"
              class="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50"
              placeholder="용어 제목을 입력하세요"
            >
          </div>
          <div class="flex items-center space-x-4 flex-shrink-0">
            <span class="text-sm text-gray-500">{{ selectedTerm.createdAt }}</span>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 모달 내용 영역 (60% 고정) -->
        <div class="p-6 overflow-y-auto" style="height: 60vh;">
          <!-- 설명 (편집 가능) -->
          <div class="mb-6">
            <label class="block text-base font-bold text-gray-700 mb-2">용어 설명</label>
            <textarea 
              v-model="editBody"
              :rows="calculateRows(editBody)"
              class="w-full text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50"
              placeholder="용어 설명을 입력하세요"
            ></textarea>
          </div>   
        </div>

         <!-- 모달 하단 -->
         <div class="p-6 border-t border-gray-200">
           <!-- 메타 정보 -->
           <div class="mb-10">
             <div class="flex flex-wrap gap-3 justify-center">
               <div class="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full text-sm font-medium">
                 <input 
                   v-model="editCategory"
                   class="bg-transparent border-none outline-none focus:bg-indigo-200 focus:px-2 focus:py-2 focus:rounded-lg transition-all duration-200 hover:bg-indigo-200 text-center min-w-0"
                   placeholder="카테고리"
                 >
               </div>
               <div class="bg-gray-100 text-gray-800 px-3 py-2 rounded-full text-sm font-medium">
                 <input 
                   v-model="editReference"
                   class="bg-transparent border-none outline-none focus:bg-gray-200 focus:px-2 focus:py-2 focus:rounded-lg transition-all duration-200 hover:bg-gray-200 text-center min-w-0"
                   placeholder="참고 구절"
                 >
               </div>
               <div class="bg-gray-100 text-gray-800 px-3 py-2 rounded-full text-sm font-medium">
                 <input 
                   v-model="editAuthor"
                   class="bg-transparent border-none outline-none focus:bg-gray-200 focus:px-2 focus:py-2 focus:rounded-lg transition-all duration-200 hover:bg-gray-200 text-center min-w-0"
                   placeholder="작성자"
                 >
               </div>
             </div>
           </div>

           <!-- 버튼 그룹 -->
           <div class="flex justify-center space-x-4">
             <button
               v-if="role === 'admin'" 
               @click="updateTerm"
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
               @click="deleteTerm"
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
  middleware: ['auth']
})

// 사용자 인증 정보 (Pinia store 사용)
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)
const role = computed(() => authStore.currentUserRole)

const searchTerm = ref('')
const selectedCategory = ref('전체')
const selectedTermId = ref(null)
const viewMode = ref('list') // 'list' 또는 'add'

// 모달 관련 변수들
const modalOpen = ref(false)
const selectedTerm = ref({})
const editTitle = ref('')
const editBody = ref('')
const editCategory = ref('')
const editReference = ref('')
const editAuthor = ref('')
const updating = ref(false)
const deleting = ref(false)

// 새 용어 추가 관련 변수들
const newTerm = ref({
  title: '',
  body: '',
  category: '',
  reference: ''
})
const adding = ref(false)

// 페이지네이션 관련
const currentPage = ref(1)
const itemsPerPage = ref(10)

// 카테고리 목록 (동적으로 생성)
const categories = computed(() => {
  const categorySet = new Set(['전체'])
  terms.value.forEach(term => {
    if (term.category) {
      categorySet.add(term.category)
    }
  })
  // 원본 기본 순서를 유지한 배열을 반환 (정렬하지 않음)
  return Array.from(categorySet)
})

// 화면 표시용 카테고리: '전체'는 항상 맨 앞, 나머지는 역순
const displayCategories = computed(() => {
  const list = [...categories.value]
  const others = list.filter(c => c !== '전체').reverse()
  return ['전체', ...others]
})

// Firebase에서 용어 데이터 가져오기
const terms = ref([])
const loading = ref(true)

// Firebase Timestamp를 한국어 날짜 문자열로 변환하는 함수
const formatFirebaseDate = (timestamp) => {
  try {
    if (!timestamp) return ''
    
    let date
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      // Firebase Timestamp 객체
      date = timestamp.toDate()
    } else if (timestamp.seconds) {
      // Firebase Timestamp의 seconds 속성이 있는 경우
      date = new Date(timestamp.seconds * 1000)
    } else if (typeof timestamp === 'string') {
      // 이미 문자열인 경우
      return timestamp
    } else {
      // 기타 경우
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

// Firebase에서 데이터 로드
onMounted(async () => {
  await loadTermsFromFirebase()
})

const loadTermsFromFirebase = async () => {
  try {
    loading.value = true
    
    // Firebase에서 데이터 가져오기
    const { $db } = useNuxtApp()
    const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
    
    const termsCollection = collection($db, 'glossary')
    const q = query(termsCollection, orderBy('createdAt', 'desc')) // 최신순 정렬
    
    const querySnapshot = await getDocs(q)
    terms.value = querySnapshot.docs.map(doc => {
      const data = doc.data()
      
      return {
        id: doc.id,
        title: data.title || '',
        category: data.category || '',
        body: data.body || '',
        reference: data.reference || '',
        author: data.author || '',
        createdAt: formatFirebaseDate(data.createdAt)
      }
    })
    
    console.log('Firebase에서 용어 데이터 로드 완료:', terms.value.length, '개')
  } catch (error) {
    console.error('용어 데이터 로드 실패:', error)
    
    // 에러 발생시 빈 배열로 초기화
    terms.value = []
    
    // 사용자에게 에러 메시지 표시 (선택사항)
    // alert('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
  } finally {
    loading.value = false
  }
}

// 필터링된 용어 목록 (페이지네이션 전)
const allFilteredTerms = computed(() => {
  let filtered = terms.value

  // 카테고리 필터
  if (selectedCategory.value !== '전체') {
    filtered = filtered.filter(term => term.category === selectedCategory.value)
  }

  // 검색어 필터
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase().trim()
    filtered = filtered.filter(term => 
      (term.title && term.title.toLowerCase().includes(search)) ||
      (term.body && term.body.toLowerCase().includes(search)) ||
      (term.reference && term.reference.toLowerCase().includes(search)) ||
      (term.author && term.author.toLowerCase().includes(search)) ||
      (term.category && term.category.toLowerCase().includes(search))
    )
  }

  return filtered
})

// 페이지네이션 계산 (10개씩, 10페이지 단위 그룹 이동)
const pagesPerGroup = ref(10)
const totalPages = computed(() => Math.ceil(allFilteredTerms.value.length / itemsPerPage.value))
const totalGroups = computed(() => Math.ceil(totalPages.value / pagesPerGroup.value))
const currentGroup = ref(1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

// 현재 페이지의 용어 목록
const filteredTerms = computed(() => {
  return allFilteredTerms.value.slice(startIndex.value, endIndex.value)
})

// 페이지네이션 표시용 페이지 번호들 (현재 그룹 기준 10개)
const visiblePages = computed(() => {
  const pages = []
  const start = (currentGroup.value - 1) * pagesPerGroup.value + 1
  const end = Math.min(currentGroup.value * pagesPerGroup.value, totalPages.value)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// 용어 선택/해제 (기존 기능 유지)
const selectTerm = (term) => {
  if (selectedTermId.value === term.id) {
    selectedTermId.value = null
  } else {
    selectedTermId.value = term.id
  }
}

// 모달 열기
const openModal = (term) => {
  selectedTerm.value = term
  editTitle.value = term.title
  editBody.value = term.body
  editCategory.value = term.category
  editReference.value = term.reference
  editAuthor.value = term.author
  modalOpen.value = true
}

// 모달 닫기
const closeModal = () => {
  modalOpen.value = false
  selectedTerm.value = {}
  editTitle.value = ''
  editBody.value = ''
  editCategory.value = ''
  editReference.value = ''
  editAuthor.value = ''
  updating.value = false
  deleting.value = false
}

// 텍스트 영역 행 수 계산 (AboutView.vue에서 가져옴)
const calculateRows = (text) => {
  if (!text) return 3
  const lines = text.split('\n')
  let totalRows = lines.length
  for (let line of lines) {
    totalRows += Math.floor(line.length / 80) // 80자가 넘어가면 추가 행 계산
  }
  return Math.max(3, totalRows) // 최소 3행을 보장
}

// 페이지 이동
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    currentGroup.value = Math.ceil(page / pagesPerGroup.value)
    selectedTermId.value = null // 페이지 변경시 선택 해제
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

// 데이터 새로고침
const refreshData = async () => {
  await loadTermsFromFirebase()
  currentPage.value = 1
  selectedTermId.value = null
}

// 필터 초기화
const clearFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = '전체'
  currentPage.value = 1
  selectedTermId.value = null
}

// 용어 수정 함수
const updateTerm = async () => {
  if (!selectedTerm.value.id) return
  
  try {
    updating.value = true
    
    const { $db } = useNuxtApp()
    const { doc, updateDoc } = await import('firebase/firestore')
    
    const termDoc = doc($db, 'glossary', selectedTerm.value.id)
    await updateDoc(termDoc, {
      title: editTitle.value,
      body: editBody.value,
      category: editCategory.value,
      reference: editReference.value,
      author: editAuthor.value
    })
    
    // 로컬 데이터 업데이트
    const termIndex = terms.value.findIndex(term => term.id === selectedTerm.value.id)
    if (termIndex !== -1) {
      terms.value[termIndex] = {
        ...terms.value[termIndex],
        title: editTitle.value,
        body: editBody.value,
        category: editCategory.value,
        reference: editReference.value,
        author: editAuthor.value
      }
    }
    
    // 선택된 용어도 업데이트
    selectedTerm.value = {
      ...selectedTerm.value,
      title: editTitle.value,
      body: editBody.value,
      category: editCategory.value,
      reference: editReference.value,
      author: editAuthor.value
    }
    
    console.log('용어 수정 완료')
    alert('용어가 성공적으로 수정되었습니다.')
    
  } catch (error) {
    console.error('용어 수정 실패:', error)
    alert('용어 수정 중 오류가 발생했습니다.')
  } finally {
    updating.value = false
  }
}

// 용어 삭제 함수
const deleteTerm = async () => {
  if (!selectedTerm.value.id) return
  
  if (!confirm('정말로 이 용어를 삭제하시겠습니까?')) {
    return
  }
  
  try {
    deleting.value = true
    
    const { $db } = useNuxtApp()
    const { doc, deleteDoc } = await import('firebase/firestore')
    
    const termDoc = doc($db, 'glossary', selectedTerm.value.id)
    await deleteDoc(termDoc)
    
    // 로컬 데이터에서 제거
    terms.value = terms.value.filter(term => term.id !== selectedTerm.value.id)
    
    console.log('용어 삭제 완료')
    alert('용어가 성공적으로 삭제되었습니다.')
    
    // 모달 닫기
    closeModal()
    
  } catch (error) {
    console.error('용어 삭제 실패:', error)
    alert('용어 삭제 중 오류가 발생했습니다.')
  } finally {
    deleting.value = false
  }
}

// 새 용어 추가 함수
const addNewTerm = async () => {
  try {
    adding.value = true
    
    const { $db } = useNuxtApp()
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    
    const termsCollection = collection($db, 'glossary')
    
    const docRef = await addDoc(termsCollection, {
      title: newTerm.value.title,
      body: newTerm.value.body,
      category: newTerm.value.category,
      reference: newTerm.value.reference,
      author: '관리자',
      createdAt: serverTimestamp()
    })
    
    // 로컬 데이터에 새 용어 추가
    const newTermData = {
      id: docRef.id,
      title: newTerm.value.title,
      body: newTerm.value.body,
      category: newTerm.value.category,
      reference: newTerm.value.reference,
      author: '관리자',
      createdAt: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    terms.value.unshift(newTermData) // 최신순으로 맨 앞에 추가
    
    // 폼 초기화
    newTerm.value = {
      title: '',
      body: '',
      category: '',
      reference: ''
    }
    
    // 목록 보기로 전환
    viewMode.value = 'list'
    
    console.log('새 용어 추가 완료')
    alert('용어가 성공적으로 추가되었습니다.')
    
  } catch (error) {
    console.error('용어 추가 실패:', error)
    alert('용어 추가 중 오류가 발생했습니다.')
  } finally {
    adding.value = false
  }
}

// 검색이나 필터 변경시 첫 페이지로 이동
watch([searchTerm, selectedCategory], () => {
  currentPage.value = 1
  selectedTermId.value = null
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

/* 1280px 밑에서 안쪽 스크롤바 제거 */
@media (max-width: 1280px) {
  .max-h-screen {
    max-height: none !important;
    overflow-y: visible !important;
  }
}
</style>
