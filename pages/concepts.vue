<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <h1 class="text-[1.8rem] xl:text-3xl font-bold text-gray-800 mb-4">철학 개념</h1>
        <p class="text-gray-600">기독교 철학과 신학의 핵심 개념들을 체계적으로 이해할 수 있도록 안내하는 가이드입니다.</p>
      </div>

      <!-- 스위칭 버튼 -->
      <!-- <div class="flex justify-center mb-6" v-if="role === 'admin'">
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
            철학개념 목록
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
            철학개념 추가
          </button>
        </div>
      </div> -->

      <!-- 검색 영역 -->
      <div class="max-w-6xl mx-auto mb-8">
        <div class="flex items-center space-x-4">
          <!-- 검색창 -->
          <div class="relative flex-1">
            <input 
              v-model="searchTerm"
              type="text" 
              placeholder="예: 1, 101, 계몽주의, 과정주의"
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
          
          <!-- 개념 선택 버튼 -->
          <button
            @click="openConceptSelectionModal"
            class="px-4 py-3 bg-indigo-300 text-white rounded-lg hover:bg-indigo-400 transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <span>개념 선택</span>
          </button>
          
          <!-- 검색 초기화 버튼 -->
          <button
            @click="clearFilters"
            class="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer" 
          >
            <span>초기화</span>
          </button>
        </div>
      </div>

      <!-- 철학개념 폼 -->
      <div v-if="viewMode === 'add'" class="max-w-6xl mx-auto mb-8 border border-gray-200 rounded-lg">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">새 철학개념 추가</h2>
          
          <form @submit.prevent="addNewConcept" class="space-y-4">
            <!-- 철학개념 제목 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">철학개념 제목</label>
              <input 
                v-model="newConcept.title"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="철학개념 제목을 입력하세요"
              >
            </div>
            
            <!-- 영문 소제목 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">영문 소제목</label>
              <input 
                v-model="newConcept.subtitle_en"
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="영문 소제목을 입력하세요 (선택사항)"
              >
            </div>
            
            <!-- 철학개념 내용 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">철학개념 내용</label>
              <textarea 
                v-model="newConcept.body"
                required
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="철학개념 내용을 입력하세요"
              ></textarea>
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
                <span>{{ adding ? '추가 중...' : '철학개념 추가' }}</span>
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- 철학개념 목록 (리스트 형식) -->
      <div v-else-if="viewMode === 'list'" class="max-w-6xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div
          v-for="(concept, index) in filteredConcepts"
          :key="concept.id"
          :class="[
            'border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
            index === filteredConcepts.length - 1 ? 'border-b-0' : ''
          ]"
          @click="openModal(concept)"
        >
          <div class="p-6">
            <!-- 메인 내용 -->
            <div class="flex items-start space-x-4">
              <!-- 아이콘 -->
              <div class="flex-shrink-0 mt-1">
                <div class="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center">
                  <i class="fa fa-lightbulb-o text-white text-lg fa-fw"></i>
                </div>
              </div>
              
              <!-- 내용 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-md xl:text-lg font-semibold text-gray-900 truncate">
                    {{ concept.id }}. {{ concept.title }}
                  </h3>
                  <div class="flex items-center space-x-2 ml-4">
                    <span class="text-sm text-gray-500">{{ concept.createdAt }}</span>
                    <span class="text-sm text-gray-400 hidden sm:block">{{ concept.author }}</span>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ concept.body }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span v-if="concept.subtitle_en" class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {{ concept.subtitle_en }}
                    </span>
                  </div>
                  
                  <button 
                    class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
                    @click.stop="openModal(concept)"
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
      <div v-if="allFilteredConcepts.length > 0" class="max-w-6xl mx-auto flex justify-center mt-8">
        <nav class="flex items-center space-x-1">
          <button :disabled="currentGroup <= 1" @click="goToPrevGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentPage === page ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">{{ page }}</button>
          <button :disabled="currentGroup >= totalGroups" @click="goToNextGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup >= totalGroups ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
        </nav>
      </div>

      <!-- 데이터가 없을 때 -->
      <div v-if="!loading && allFilteredConcepts.length === 0" class="max-w-6xl mx-auto text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <p class="text-gray-500 mb-4">
          {{ searchTerm ? '검색 조건에 맞는 철학개념이 없습니다.' : '등록된 철학개념이 없습니다.' }}
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

    <!-- 철학개념 선택 팝업 -->
    <div v-if="conceptSelectionModal" class="fixed top-[-70px] inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeConceptSelectionModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <!-- 팝업 헤더 -->
        <div class="flex justify-center items-center p-6 border-b border-gray-200 relative">
          <h2 class="text-2xl font-bold text-gray-800">철학개념 선택</h2>
          <button 
            @click="closeConceptSelectionModal"
            class="absolute right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 개념 버튼 그리드 -->
        <div class="p-6 overflow-y-auto flex-1">
          <!-- 모든 버튼을 연속적으로 배치 (색상만 20개 단위로 구분) -->
          <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
            <button
              v-for="concept in concepts"
              :key="concept.id"
              @click="toggleConceptSelection(concept.id)"
              :class="getConceptButtonClasses(concept.id)"
              :style="getConceptButtonStyle(concept.id)"
              :title="`${concept.id}. ${concept.title}`"
              class="concept-button"
            >
              <span class="truncate">{{ concept.id }}. {{ concept.title }}</span>
            </button>
          </div>
        </div>

        <!-- 팝업 하단 버튼 -->
        <div class="p-6 border-t border-gray-200 flex justify-center space-x-4">
          <button
            @click="searchSelectedConcepts"
            :disabled="selectedConceptIds.length === 0"
            class="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            찾아보기 ({{ selectedConceptIds.length }}개 선택)
          </button>
          <button
            @click="closeConceptSelectionModal"
            class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
          >
            창닫기
          </button>
        </div>
      </div>
    </div>

    <!-- 철학개념 상세 모달 -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full lg:w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- 모달 헤더 -->
        <div class="p-6 border-b border-gray-200">
          <!-- 닫기 버튼 (우상단) -->
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
          
          <!-- 제목 영역 (중앙정렬) -->
          <div class="text-center">
            <!-- 한글 제목 (편집 가능) -->
            <input 
              v-if="role === 'admin'"
              v-model="editTitle"
              class="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50 text-center"
              :placeholder="`${selectedConcept.id}. 철학개념 제목을 입력하세요`"
            >
            <h2 
              v-else
              class="w-full text-2xl font-bold text-gray-800"
            >
              {{ selectedConcept.id }}. {{ selectedConcept.title }}
            </h2>
            
            <!-- 영문 제목 (편집 가능) -->
            <input 
              v-if="role === 'admin'"
              v-model="editSubtitleEn"
              class="w-full text-lg text-gray-600 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50 text-center mt-2 italic"
              placeholder="영문 제목을 입력하세요 (선택사항)"
            >
            <p 
              v-else-if="selectedConcept.subtitle_en"
              class="w-full text-lg text-gray-600 text-center mt-2 italic"
            >
              {{ selectedConcept.subtitle_en }}
            </p>
          </div>
        </div>

        <!-- 모달 내용 영역 (60% 고정) -->
        <div class="p-6 overflow-y-auto" style="height: 60vh;">
          <!-- 설명 (편집 가능) -->
          <div class="mb-6">
            <label class="block text-base font-bold text-gray-700 mb-2 sr-only">철학개념 내용</label>
            <textarea 
              v-if="role === 'admin'"
              v-model="editBody"
              :rows="calculateRows(editBody)"
              class="w-full text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50"
              placeholder="철학개념 내용을 입력하세요"
            ></textarea>
            <div 
              v-else
              class="w-full px-4 py-3 text-gray-700 leading-relaxed whitespace-pre-wrap"
            >
              {{ selectedConcept.body }}
            </div>
          </div>   
        </div>

         <!-- 모달 하단 -->
         <div class="p-6 border-t border-gray-200">
           <!-- 메타 정보 -->
           <div class="mb-10">
             <div class="flex flex-wrap gap-3 justify-center">
               <div class="bg-gray-100 text-gray-800 px-15 py-2 rounded-full text-sm font-medium"> 
                 <input 
                   v-if="role === 'admin'"
                   v-model="editAuthor"
                   class="bg-transparent border-none outline-none focus:bg-indigo-200 focus:px-2 focus:py-2 focus:rounded-lg transition-all duration-200 hover:bg-indigo-200 text-center min-w-0"
                   placeholder="관리자"
                 >
                 <span v-else>{{ selectedConcept.author || '관리자' }}</span>
               </div>
               <!-- <div class="bg-gray-100 text-gray-800 px-3 py-2 rounded-full text-sm font-medium">
                 <span>{{ selectedConcept.createdAt }}</span>
               </div> -->
             </div>
           </div>

           <!-- 버튼 그룹 -->
           <div class="flex justify-center space-x-4">
             <button
               v-if="role === 'admin'" 
               @click="updateConcept"
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
               @click="deleteConcept"
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
const selectedConceptId = ref(null)
const viewMode = ref('list') // 'list' 또는 'add'
const conceptSelectionModal = ref(true) // 개념 선택 팝업 표시 여부 (페이지 로드 시 표시)
const selectedConceptIds = ref([]) // 선택된 개념 ID들

// 모달 관련 변수들
const modalOpen = ref(false)
const selectedConcept = ref({})
const editTitle = ref('')
const editBody = ref('')
const editSubtitleEn = ref('')
const editAuthor = ref('')
const updating = ref(false)
const deleting = ref(false)

// 새 철학개념 추가 관련 변수들
const newConcept = ref({
  title: '',
  subtitle_en: '',
  body: ''
})
const adding = ref(false)

// 페이지네이션 관련
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Firebase에서 철학개념 데이터 가져오기
const concepts = ref([])
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
  console.log('[PAGE] concepts mounted')
  await loadConceptsFromFirebase()
})

// 정확한 철학개념 목록 (참고사항 기준)
const predefinedConcepts = [
  { id: '1', title: '계몽주의' },
  { id: '2', title: '과정사상' },
  { id: '3', title: '관념론' },
  { id: '4', title: '관점주의' },
  { id: '5', title: '기적' },
  { id: '6', title: '기호학' },
  { id: '7', title: '논리학' },
  { id: '8', title: '니체' },
  { id: '9', title: '다원주의·배타주의·포용주의' },
  { id: '10', title: '단순성' },
  { id: '11', title: '데카르트' },
  { id: '12', title: '둔스 스코투스' },
  { id: '13', title: '라이프니츠' },
  { id: '14', title: '로고스' },
  { id: '15', title: '르네상스 인문주의' },
  { id: '16', title: '마르크스' },
  { id: '17', title: '마음·영혼·정신' },
  { id: '18', title: '모더니티·모더니즘' },
  { id: '19', title: '목적론' },
  { id: '20', title: '무신론' },
  { id: '21', title: '미결정성' },
  { id: '22', title: '미학' },
  { id: '23', title: '변증학' },
  { id: '24', title: '보편자' },
  { id: '25', title: '본질·본질주의' },
  { id: '26', title: '부활·불멸성' },
  { id: '27', title: '분석철학·대륙철학' },
  { id: '28', title: '불변성·무감수성' },
  { id: '29', title: '비트겐슈타인' },
  { id: '30', title: '상대주의' },
  { id: '31', title: '상식 철학' },
  { id: '32', title: '선·선함' },
  { id: '33', title: '슐라이어마허' },
  { id: '34', title: '스콜라 철학' },
  { id: '35', title: '스토아 철학' },
  { id: '36', title: '신앙' },
  { id: '37', title: '신앙과 이성' },
  { id: '38', title: '신인동형론적 언어' },
  { id: '39', title: '신정론' },
  { id: '40', title: '신 존재 논증' },
  { id: '41', title: '신플라톤주의' },
  { id: '42', title: '실용주의' },
  { id: '43', title: '실재론·반실재론' },
  { id: '44', title: '실존주의' },
  { id: '45', title: '실증주의' },
  { id: '46', title: '실체' },
  { id: '47', title: '아리스토텔레스' },
  { id: '48', title: '아우구스티누스' },
  { id: '49', title: '아퀴나스' },
  { id: '50', title: '악의 문제' },
  { id: '51', title: '안셀무스' },
  { id: '52', title: '에우튀프론 문제' },
  { id: '53', title: '영원·불후' },
  { id: '54', title: '오컴' },
  { id: '55', title: '우주론' },
  { id: '56', title: '원인·인과성' },
  { id: '57', title: '위-디오니시오스' },
  { id: '58', title: '윤리학' },
  { id: '59', title: '윤리학(성경적)' },
  { id: '60', title: '이성·합리성' },
  { id: '61', title: '이성과 믿음(하나님께 대한)' },
  { id: '62', title: '이원론·일원론' },
  { id: '63', title: '인간 본성' },
  { id: '64', title: '인식론' },
  { id: '65', title: '일상 언어 철학' },
  { id: '66', title: '자아' },
  { id: '67', title: '자연 신학' },
  { id: '68', title: '자연주의·유물론' },
  { id: '69', title: '자유 의지' },
  { id: '70', title: '전능' },
  { id: '71', title: '전지·예지' },
  { id: '72', title: '정의' },
  { id: '73', title: '존재신론' },
  { id: '74', title: '존재와 선함' },
  { id: '75', title: '종교 언어' },
  { id: '76', title: '지옥' },
  { id: '77', title: '진리' },
  { id: '78', title: '철학' },
  { id: '79', title: '초월' },
  { id: '80', title: '칸트' },
  { id: '81', title: '키에르케고어' },
  { id: '82', title: '파스칼' },
  { id: '83', title: '페미니즘·페미니스트 철학' },
  { id: '84', title: '편재' },
  { id: '85', title: '포스트모더니즘' },
  { id: '86', title: '포이어바흐' },
  { id: '87', title: '프로이트' },
  { id: '88', title: '플라톤·플라톤주의' },
  { id: '89', title: '필연성' },
  { id: '90', title: '하나님(신앙의)' },
  { id: '91', title: '하나님의 본성' },
  { id: '92', title: '하이데거' },
  { id: '93', title: '해석학' },
  { id: '94', title: '해체' },
  { id: '95', title: '행복' },
  { id: '96', title: '허무주의' },
  { id: '97', title: '헤겔' },
  { id: '98', title: '현상학' },
  { id: '99', title: '형이상학·존재론' },
  { id: '100', title: '환원주의' },
  { id: '101', title: '흄' }
]

const loadConceptsFromFirebase = async () => {
  try {
    loading.value = true
    
    // Firebase에서 데이터 가져오기
    const { $db } = useNuxtApp()
    const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
    
    const conceptsCollection = collection($db, 'concepts')
    const q = query(conceptsCollection) // 기본 쿼리 (인덱스 문제 해결)
    
    const querySnapshot = await getDocs(q)
    const rawConcepts = querySnapshot.docs.map(doc => {
      const data = doc.data()
      
      return {
        id: doc.id,
        title: data.title || '',
        subtitle_en: data.subtitle_en || '',
        body: data.body || '',
        author: data.author || '',
        createdAt: formatFirebaseDate(data.createdAt || data.createAt)
      }
    })
    
    // Firebase 데이터와 정확한 개념 목록을 매칭
    const matchedConcepts = []
    
    // 정확한 개념 목록을 기준으로 매칭
    predefinedConcepts.forEach(predefined => {
      const firebaseConcept = rawConcepts.find(concept => concept.id === predefined.id)
      
      if (firebaseConcept) {
        // Firebase에 데이터가 있으면 사용
        matchedConcepts.push({
          ...firebaseConcept,
          title: predefined.title // 제목은 정확한 것으로 교체
        })
      } else {
        // Firebase에 데이터가 없으면 기본 구조로 생성
        matchedConcepts.push({
          id: predefined.id,
          title: predefined.title,
          subtitle_en: '',
          body: '',
          author: '',
          createdAt: ''
        })
      }
    })
    
    // ID 순서로 정렬
    concepts.value = matchedConcepts.sort((a, b) => {
      const idA = parseInt(a.id) || 0
      const idB = parseInt(b.id) || 0
      return idA - idB
    })
    
    console.log('Firebase에서 철학개념 데이터 로드 완료:', concepts.value.length, '개')
  } catch (error) {
    console.error('철학개념 데이터 로드 실패:', error)
    
    // 에러 발생시 정확한 개념 목록으로 초기화
    concepts.value = predefinedConcepts.map(concept => ({
      ...concept,
      subtitle_en: '',
      body: '',
      author: '',
      createdAt: ''
    }))
  } finally {
    loading.value = false
  }
}

// 필터링된 철학개념 목록 (페이지네이션 전)
const allFilteredConcepts = computed(() => {
  let filtered = concepts.value

  // 검색어 필터 (제목만 검색)
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase().trim()
    
    // 쉼표로 구분된 여러 검색어 처리
    const searchTerms = search.split(',').map(term => term.trim()).filter(term => term)
    
    filtered = filtered.filter(concept => {
      if (!concept.title) return false
      
      // 각 검색어에 대해 하나라도 매치되면 포함
      return searchTerms.some(searchTerm => {
        // 번호 검색 (예: "1", "101" 등)
        if (searchTerm === concept.id) return true
        
        // 제목 내용 검색 (예: "계몽주의", "과정주의" 등)
        const titleText = concept.title.toLowerCase()
        return titleText.includes(searchTerm)
      })
    })
  }

  return filtered
})

// 페이지네이션 계산 (10페이지 단위 그룹)
const pagesPerGroup = ref(10)
const totalPages = computed(() => Math.ceil(allFilteredConcepts.value.length / itemsPerPage.value))
const totalGroups = computed(() => Math.ceil(totalPages.value / pagesPerGroup.value))
const currentGroup = ref(1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

// 현재 페이지의 철학개념 목록
const filteredConcepts = computed(() => {
  return allFilteredConcepts.value.slice(startIndex.value, endIndex.value)
})

// 페이지네이션 표시용 페이지 번호들 (현재 그룹 기준)
const visiblePages = computed(() => {
  const pages = []
  const start = (currentGroup.value - 1) * pagesPerGroup.value + 1
  const end = Math.min(currentGroup.value * pagesPerGroup.value, totalPages.value)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// 철학개념 선택/해제 (기존 기능 유지)
const selectConcept = (concept) => {
  if (selectedConceptId.value === concept.id) {
    selectedConceptId.value = null
  } else {
    selectedConceptId.value = concept.id
  }
}

// 모달 열기
const openModal = (concept) => {
  selectedConcept.value = concept
  editTitle.value = concept.title
  editBody.value = concept.body
  editSubtitleEn.value = concept.subtitle_en
  editAuthor.value = concept.author
  modalOpen.value = true
}

// 모달 닫기
const closeModal = () => {
  modalOpen.value = false
  selectedConcept.value = {}
  editTitle.value = ''
  editBody.value = ''
  editSubtitleEn.value = ''
  editAuthor.value = ''
  updating.value = false
  deleting.value = false
}

// 텍스트 영역 행 수 계산
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
    selectedConceptId.value = null // 페이지 변경시 선택 해제
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
  await loadConceptsFromFirebase()
  currentPage.value = 1
  selectedConceptId.value = null
}

// 필터 초기화
const clearFilters = () => {
  searchTerm.value = ''
  selectedConceptIds.value = [] // 선택된 개념들 초기화
  currentPage.value = 1
  selectedConceptId.value = null
}

// 철학개념 수정 함수
const updateConcept = async () => {
  if (!selectedConcept.value.id) return
  
  try {
    updating.value = true
    
    const { $db } = useNuxtApp()
    const { doc, updateDoc } = await import('firebase/firestore')
    
    const conceptDoc = doc($db, 'concepts', selectedConcept.value.id)
    await updateDoc(conceptDoc, {
      title: editTitle.value,
      body: editBody.value,
      subtitle_en: editSubtitleEn.value,
      author: editAuthor.value
    })
    
    // 로컬 데이터 업데이트
    const conceptIndex = concepts.value.findIndex(concept => concept.id === selectedConcept.value.id)
    if (conceptIndex !== -1) {
      concepts.value[conceptIndex] = {
        ...concepts.value[conceptIndex],
        title: editTitle.value,
        body: editBody.value,
        subtitle_en: editSubtitleEn.value,
        author: editAuthor.value
      }
    }
    
    // 선택된 철학개념도 업데이트
    selectedConcept.value = {
      ...selectedConcept.value,
      title: editTitle.value,
      body: editBody.value,
      subtitle_en: editSubtitleEn.value,
      author: editAuthor.value
    }
    
    console.log('철학개념 수정 완료')
    alert('철학개념이 성공적으로 수정되었습니다.')
    
  } catch (error) {
    console.error('철학개념 수정 실패:', error)
    alert('철학개념 수정 중 오류가 발생했습니다.')
  } finally {
    updating.value = false
  }
}

// 철학개념 삭제 함수
const deleteConcept = async () => {
  if (!selectedConcept.value.id) return
  
  if (!confirm('정말로 이 철학개념을 삭제하시겠습니까?')) {
    return
  }
  
  try {
    deleting.value = true
    
    const { $db } = useNuxtApp()
    const { doc, deleteDoc } = await import('firebase/firestore')
    
    const conceptDoc = doc($db, 'concepts', selectedConcept.value.id)
    await deleteDoc(conceptDoc)
    
    // 로컬 데이터에서 제거
    concepts.value = concepts.value.filter(concept => concept.id !== selectedConcept.value.id)
    
    console.log('철학개념 삭제 완료')
    alert('철학개념이 성공적으로 삭제되었습니다.')
    
    // 모달 닫기
    closeModal()
    
  } catch (error) {
    console.error('철학개념 삭제 실패:', error)
    alert('철학개념 삭제 중 오류가 발생했습니다.')
  } finally {
    deleting.value = false
  }
}

// 새 철학개념 추가 함수
const addNewConcept = async () => {
  try {
    adding.value = true
    
    const { $db } = useNuxtApp()
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    
    const conceptsCollection = collection($db, 'concepts')
    
    const docRef = await addDoc(conceptsCollection, {
      title: newConcept.value.title,
      subtitle_en: newConcept.value.subtitle_en,
      body: newConcept.value.body,
      author: '관리자',
      createAt: serverTimestamp()
    })
    
    // 로컬 데이터에 새 철학개념 추가
    const newConceptData = {
      id: docRef.id,
      title: newConcept.value.title,
      subtitle_en: newConcept.value.subtitle_en,
      body: newConcept.value.body,
      author: '관리자',
      createdAt: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    concepts.value.push(newConceptData)
    
    // 폼 초기화
    newConcept.value = {
      title: '',
      subtitle_en: '',
      body: ''
    }
    
    // 목록 보기로 전환
    viewMode.value = 'list'
    
    console.log('새 철학개념 추가 완료')
    alert('철학개념이 성공적으로 추가되었습니다.')
    
  } catch (error) {
    console.error('철학개념 추가 실패:', error)
    alert('철학개념 추가 중 오류가 발생했습니다.')
  } finally {
    adding.value = false
  }
}

// 검색 변경시 첫 페이지로 이동
watch([searchTerm], () => {
  currentPage.value = 1
  selectedConceptId.value = null
})

// 개념 선택 관련 함수들
const getConceptsInGroup = (groupIndex) => {
  const startIndex = groupIndex * 20
  const endIndex = Math.min(startIndex + 20, concepts.value.length)
  return concepts.value.slice(startIndex, endIndex)
}

const getConceptButtonStyle = (conceptId) => {
  const conceptNum = parseInt(conceptId)
  const isSelected = selectedConceptIds.value.includes(conceptId)
  
  let backgroundColor = ''
  let borderColor = ''
  let textColor = ''
  let selectedBgColor = ''
  
  if (conceptNum <= 20) {
    backgroundColor = '#CEE5FF'
    borderColor = '#A3C7FF'
    textColor = '#1E3A8A'
    selectedBgColor = '#3B82F6' // 진한 파란색
  } else if (conceptNum <= 40) {
    backgroundColor = '#B9EAD6'
    borderColor = '#86D4B0'
    textColor = '#166534'
    selectedBgColor = '#10B981' // 진한 초록색
  } else if (conceptNum <= 60) {
    backgroundColor = '#E3EBBF'
    borderColor = '#D1E08A'
    textColor = '#365314'
    selectedBgColor = '#84CC16' // 진한 라임색
  } else if (conceptNum <= 80) {
    backgroundColor = '#FEDDC8'
    borderColor = '#FDBB8F'
    textColor = '#9A3412'
    selectedBgColor = '#F97316' // 진한 주황색
  } else {
    backgroundColor = '#FFD3D3'
    borderColor = '#FFA8A8'
    textColor = '#991B1B'
    selectedBgColor = '#EF4444' // 진한 빨간색
  }
  
  return {
    backgroundColor: isSelected ? selectedBgColor : backgroundColor,
    borderColor: isSelected ? selectedBgColor : borderColor,
    color: isSelected ? '#FFFFFF' : textColor,
    borderWidth: '2px',
    borderStyle: 'solid',
    padding: '8px 12px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: isSelected ? '600' : '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
    height: '40px'
  }
}

const getConceptButtonClasses = (conceptId) => {
  return `hover:opacity-90 transition-all duration-200`
}

const toggleConceptSelection = (conceptId) => {
  const index = selectedConceptIds.value.indexOf(conceptId)
  if (index > -1) {
    selectedConceptIds.value.splice(index, 1)
  } else {
    selectedConceptIds.value.push(conceptId)
  }
}

const openConceptSelectionModal = () => {
  conceptSelectionModal.value = true
}

const closeConceptSelectionModal = () => {
  conceptSelectionModal.value = false
}

const searchSelectedConcepts = () => {
  if (selectedConceptIds.value.length === 0) return
  
  // 선택된 개념들의 제목으로 검색어 생성
  const selectedTitles = selectedConceptIds.value.map(id => {
    const concept = concepts.value.find(c => c.id === id)
    return concept ? concept.title : ''
  }).filter(title => title)
  
  // 검색어를 쉼표로 구분하여 설정
  searchTerm.value = selectedTitles.join(', ')
  
  // 팝업 닫기
  conceptSelectionModal.value = false
  
  // 첫 페이지로 이동
  currentPage.value = 1
  selectedConceptId.value = null
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 개념 버튼 스타일 */
.concept-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
}

.concept-button .truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  display: block;
}

/* 1280px 밑에서 안쪽 스크롤바 제거 */
@media (max-width: 1280px) {
  .max-h-screen {
    max-height: none !important;
    overflow-y: visible !important;
  }
}
</style>