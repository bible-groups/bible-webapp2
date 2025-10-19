<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <h1 class="text-[1.8rem] xl:text-3xl font-bold text-gray-800 mb-4">호크마</h1>
        <p class="text-gray-600">성경 요약과 호크마 주석을 통해 말씀을 깊이 있게 탐구하세요</p>
      </div>

      <!-- 스위칭 버튼 -->
      <div class="flex justify-center mb-6">
        <div class="bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          <button
            @click="activeTab = 'summary'"
            :class="[
              'px-6 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
              activeTab === 'summary' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            성경 요약
          </button>
          <button
            @click="activeTab = 'commentary'"
            :class="[
              'px-6 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
              activeTab === 'commentary' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            호크마 주석
          </button>
        </div>
      </div>

      <!-- 성경 요약 탭 -->
      <div v-if="activeTab === 'summary'" class="w-full lg:max-w-6xl lg:mx-auto">
        <!-- 검색 영역 -->
        <div class="mb-8">
          <div class="relative w-2/3 mx-auto">
            <input 
              v-model="summarySearchTerm"
              type="text" 
              placeholder="성경책명을 입력하세요 (예: 창세기, 출애굽기...)"
              class="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
              <button
                @click="refreshSummaryData"
                :disabled="loadingBibleData"
                class="p-1 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
                title="새로고침"
              >
                <svg 
                  :class="['w-4 h-4', loadingBibleData ? 'animate-spin' : '']" 
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
        </div>

        <!-- 로딩 상태 -->
        <div v-if="loadingBibleData" class="text-center py-12">
          <div class="flex flex-col items-center justify-center">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <p class="text-gray-500">데이터를 불러오는 중...</p>
          </div>
        </div>

        <!-- 성경 요약 표 -->
        <div v-else-if="filteredBibleData.length > 0" class="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-300">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead class="bg-gradient-to-r from-indigo-500 to-purple-600">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border-b-2 border-white w-1/6">장제목</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border-b-2 border-white border-l w-1/6">소제목</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border-b-2 border-white border-l w-1/2">내용</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border-b-2 border-white border-l w-1/6">구분</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <template v-for="book in filteredBibleData" :key="book.title">
                  <template v-for="chapter in book.chapters" :key="chapter.chapterTitle">
                    <!-- 섹션이 있는 경우 -->
                    <template v-if="chapter.sections.length > 0">
                      <template v-for="(section, sectionIndex) in chapter.sections" :key="section.subtitle">
                        <tr class="border-b border-gray-300">
                          <!-- 장제목 (첫 번째 섹션에서만 표시) -->
                          <td v-if="sectionIndex === 0" 
                              :rowspan="chapter.sections.length" 
                              class="px-6 py-4 text-sm font-semibold text-gray-900 bg-gray-50 border-r-2 border-gray-300 align-top">
                            <div class="font-bold text-indigo-700">{{ chapter.chapterTitle }}</div>
                          </td>
                          
                          <!-- 소제목 -->
                          <td class="px-6 py-4 text-sm font-medium text-gray-800 border-l border-gray-300">
                            <div class="font-semibold">{{ section.subtitle }}</div>
                          </td>
                          
                          <!-- 내용 -->
                          <td class="px-6 py-4 text-sm text-gray-700 border-l border-gray-300">
                            <div class="leading-relaxed whitespace-pre-line">{{ section.content }}</div>
                          </td>
                          
                          <!-- 구분 -->
                          <td class="px-6 py-4 text-sm border-l border-gray-300">
                            <span v-if="section.category" 
                                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {{ section.category }}
                            </span>
                            <span v-else class="text-gray-400 text-xs">-</span>
                          </td>
                        </tr>
                      </template>
                    </template>
                    
                    <!-- 섹션이 없는 경우 (빈 장제목만 표시) -->
                    <template v-else>
                      <tr class="border-b border-gray-300">
                        <!-- 장제목 -->
                        <td class="px-6 py-4 text-sm font-semibold text-gray-900 bg-gray-50 border-r-2 border-gray-300">
                          <div class="font-bold text-indigo-700">{{ chapter.chapterTitle }}</div>
                        </td>
                        
                        <!-- 소제목 -->
                        <td class="px-6 py-4 text-sm font-medium text-gray-800 border-l border-gray-300">
                          <div class="text-gray-400 italic">데이터 없음</div>
                        </td>
                        
                        <!-- 내용 -->
                        <td class="px-6 py-4 text-sm text-gray-700 border-l border-gray-300">
                          <div class="text-gray-400 italic">해당 섹션의 데이터가 없습니다.</div>
                        </td>
                        
                        <!-- 구분 -->
                        <td class="px-6 py-4 text-sm border-l border-gray-300">
                          <span class="text-gray-400 text-xs">-</span>
                        </td>
                      </tr>
                    </template>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 데이터가 없을 때 -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <p class="text-gray-500">
            {{ summarySearchTerm ? '검색 조건에 맞는 성경 요약이 없습니다.' : '성경 요약 데이터를 불러올 수 없습니다.' }}
          </p>
        </div>
      </div>

      <!-- 호크마 주석 탭 -->
      <div v-if="activeTab === 'commentary'" class="w-full lg:max-w-6xl lg:mx-auto">
        <!-- 검색 영역 -->
        <div class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 성경책 선택 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">성경책</label>
              <div class="relative">
                <select 
                  v-model="selectedBook" 
                  @change="onBookChange"
                  class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                >
                  <option value="">성경책을 선택하세요</option>
                  <option v-for="book in availableBooks" :key="book" :value="book">{{ book }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- 장 선택 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">장</label>
              <div class="relative">
                <select 
                  v-model.number="selectedChapter" 
                  @change="onChapterChange"
                  :disabled="!selectedBook"
                  class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 appearance-none bg-white"
                >
                  <option value="">장을 선택하세요</option>
                  <option v-for="chapter in availableChapters" :key="chapter" :value="chapter">{{ chapter }}장</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- 절 선택 -->
  <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">절</label>
              <div class="relative">
                <select 
                  v-model.number="selectedVerse" 
                  @change="onVerseChange"
                  :disabled="!selectedChapter"
                  class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 appearance-none bg-white"
                >
                  <option value="">절을 선택하세요</option>
                  <option v-for="verse in availableVerses" :key="verse" :value="verse">{{ verse }}절</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 로딩 상태 (초기 데이터 로딩 중 또는 옵션 미준비 시 표시) -->
        <div v-if="loadingCommentaryData || availableBooks.length === 0" class="text-center py-12">
          <div class="flex flex-col items-center justify-center">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <p class="text-gray-600 font-medium mb-2">호크마 주석 데이터를 불러오는 중...</p>
            <p class="text-sm text-gray-500">잠시만 기다려주세요. 모든 성경책 데이터를 병렬로 로딩하고 있습니다.</p>
          </div>
        </div>

        <!-- 호크마 주석 내용 -->
        <div v-else-if="selectedCommentary" class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <!-- 단일 주석인 경우 -->
          <div v-if="!Array.isArray(selectedCommentary)">
            <!-- 성경 구절 헤더 -->
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">
                성경: [{{ selectedCommentary.book }}{{ selectedCommentary.chapter }}:{{ selectedCommentary.verse }}]
              </h2>
              <div class="flex flex-wrap gap-2">
                <span class="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                  주제1: [{{ selectedCommentary.subject1 }}]
                </span>
                <span class="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  주제2: [{{ selectedCommentary.subject2 }}]
                </span>
              </div>
            </div>

            <!-- 주석 내용 -->
            <div class="prose max-w-none">
              <!-- 텍스트 주석 -->
              <div class="text-gray-700 leading-relaxed mb-8">
                <div v-html="formatCommentaryText(selectedCommentary.text)"></div>
              </div>

              <!-- 표 (텍스트 다음에 표시) -->
              <div v-if="selectedCommentary.table || selectedCommentary.tables" class="mb-6">
                <!-- 단일 테이블인 경우 -->
                <div v-if="selectedCommentary.table">
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">표</h3>
                  <div class="overflow-x-auto">
                    <table class="w-full border-collapse border-2 border-gray-400">
                      <thead>
                        <tr class="bg-gray-100">
                          <th v-for="header in getTableHeaders(selectedCommentary.table)" :key="header" 
                              class="border border-gray-400 px-4 py-3 text-center font-bold text-gray-800 bg-gray-200">
                            {{ header }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, index) in getTableRows(selectedCommentary.table)" :key="index" 
                            class="hover:bg-gray-50">
                          <td v-for="(header, cellIndex) in getTableHeaders(selectedCommentary.table)" :key="cellIndex" 
                              class="border border-gray-400 px-4 py-3 text-center text-gray-700 align-middle"
                              :class="{ 'font-semibold': cellIndex === 0 }">
                            <div class="whitespace-pre-line">{{ row[header] || '' }}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- 여러 테이블인 경우 -->
                <div v-else-if="selectedCommentary.tables">
                  <div v-for="(table, tableKey) in selectedCommentary.tables" :key="tableKey" class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">표</h3>
                    <div class="overflow-x-auto">
                      <table class="w-full border-collapse border-2 border-gray-400">
                        <thead>
                          <tr class="bg-gray-100">
                            <th v-for="header in getTableHeaders(table)" :key="header" 
                                class="border border-gray-400 px-4 py-3 text-center font-bold text-gray-800 bg-gray-200">
                              {{ header }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, rowIndex) in getTableRows(table)" :key="rowIndex" 
                              class="hover:bg-gray-50">
                            <td v-for="(header, cellIndex) in getTableHeaders(table)" :key="cellIndex" 
                                class="border border-gray-400 px-4 py-3 text-center text-gray-700 align-middle"
                                :class="{ 'font-semibold': cellIndex === 0 }">
                              <div class="whitespace-pre-line">{{ row[header] || '' }}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 여러 주석인 경우 (장 전체) -->
          <div v-else>
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">
                {{ selectedBook }}{{ selectedChapter }}장 전체
              </h2>
              <p class="text-gray-600">{{ selectedCommentary.length }}개의 절이 있습니다.</p>
            </div>

            <!-- 각 절별 주석 -->
            <div v-for="commentary in selectedCommentary" :key="`${commentary.book}-${commentary.chapter}-${commentary.verse}`" 
                 class="mb-8 p-4 border border-gray-200 rounded-lg">
              <!-- 절 헤더 -->
              <div class="mb-4">
                <h3 class="text-xl font-bold text-gray-800 mb-2">
                  {{ commentary.book }}{{ commentary.chapter }}:{{ commentary.verse }}절
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span class="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                    주제1: [{{ commentary.subject1 }}]
                  </span>
                  <span class="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                    주제2: [{{ commentary.subject2 }}]
                  </span>
                </div>
              </div>

              <!-- 주석 내용 -->
              <div class="prose max-w-none">
                <!-- 텍스트 주석 -->
                <div class="text-gray-700 leading-relaxed mb-8">
                  <div v-html="formatCommentaryText(commentary.text)"></div>
                </div>

                <!-- 표 (텍스트 다음에 표시) -->
                <div v-if="commentary.table || commentary.tables" class="mb-4">
                  <!-- 단일 테이블인 경우 -->
                  <div v-if="commentary.table">
                    <h4 class="text-lg font-semibold text-gray-800 mb-3">표</h4>
                    <div class="overflow-x-auto">
                      <table class="w-full border-collapse border-2 border-gray-400">
                        <thead>
                          <tr class="bg-gray-100">
                            <th v-for="header in getTableHeaders(commentary.table)" :key="header" 
                                class="border border-gray-400 px-4 py-3 text-center font-bold text-gray-800 bg-gray-200">
                              {{ header }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, rowIndex) in getTableRows(commentary.table)" :key="rowIndex" 
                              class="hover:bg-gray-50">
                            <td v-for="(header, cellIndex) in getTableHeaders(commentary.table)" :key="cellIndex" 
                                class="border border-gray-400 px-4 py-3 text-center text-gray-700 align-middle"
                                :class="{ 'font-semibold': cellIndex === 0 }">
                              <div class="whitespace-pre-line">{{ row[header] || '' }}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- 여러 테이블인 경우 -->
                  <div v-else-if="commentary.tables">
                    <div v-for="(table, tableKey) in commentary.tables" :key="tableKey" class="mb-4">
                      <h4 class="text-lg font-semibold text-gray-800 mb-3">표</h4>
                      <div class="overflow-x-auto">
                        <table class="w-full border-collapse border-2 border-gray-400">
                          <thead>
                            <tr class="bg-gray-100">
                              <th v-for="header in getTableHeaders(table)" :key="header" 
                                  class="border border-gray-400 px-4 py-3 text-center font-bold text-gray-800 bg-gray-200">
                                {{ header }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(row, rowIndex) in getTableRows(table)" :key="rowIndex" 
                                class="hover:bg-gray-50">
                              <td v-for="(header, cellIndex) in getTableHeaders(table)" :key="cellIndex" 
                                  class="border border-gray-400 px-4 py-3 text-center text-gray-700 align-middle"
                                  :class="{ 'font-semibold': cellIndex === 0 }">
                                <div class="whitespace-pre-line">{{ row[header] || '' }}</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 주석이 없을 때 -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p class="text-gray-600 font-medium mb-2">성경책, 장, 절을 선택하세요</p>
          <p class="text-sm text-gray-500">위의 드롭다운에서 원하는 성경 구절을 선택하면 호크마 주석을 확인할 수 있습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

// 탭 상태
const activeTab = ref('summary')

// 성경 요약 관련
const bibleData = ref([])
const summarySearchTerm = ref('')
const loadingBibleData = ref(true)

// 호크마 주석 관련
const commentaryData = ref([])
const loadingCommentaryData = ref(true)
const selectedBook = ref('창세기')
const selectedChapter = ref(1)
const selectedVerse = ref(1)
const selectedCommentary = ref(null)

// 사용 가능한 옵션들
const availableBooks = ref([])
const availableChapters = ref([])
const availableVerses = ref([])

// 데이터 로드
onMounted(async () => {
  // 성경 요약과 호크마 주석 데이터를 병렬로 로드
  await Promise.all([
    loadBibleData(),
    loadCommentaryData()
  ])
})

// 성경 요약 데이터 로드
const loadBibleData = async () => {
  try {
    loadingBibleData.value = true
    // public 폴더에서 직접 fetch 방식 사용
    const response = await fetch('/db/bible_reference.json')
    if (!response.ok) {
      throw new Error('Failed to fetch bible data')
    }
    bibleData.value = await response.json()
    console.log('성경 요약 데이터 로드 완료:', bibleData.value.length, '개')
    
    // 데이터 로드 후 검색 상태 복원
    restoreSearchState()
  } catch (error) {
    console.error('성경 요약 데이터 로드 실패:', error)
  } finally {
    loadingBibleData.value = false
  }
}

// 호크마 주석 데이터 로드
const loadCommentaryData = async () => {
  try {
    loadingCommentaryData.value = true
    
    // 실제 파일명과 성경책명 매핑
    const bookFileMapping = {
      '창세기': 'genesis',
      '출애굽기': 'exodus', 
      '레위기': 'leviticus',
      '민수기': 'numbers',
      '신명기': 'deuteronomy',
      '여호수아': 'joshua',
      '사사기': 'judges',
      '룻기': 'ruth',
      '사무엘상': 'first_samuel',
      '사무엘하': 'second_samuel',
      '열왕기상': 'first_kings',
      '열왕기하': 'second_kings',
      '역대상': 'first_chronicles',
      '역대하': 'second_chronicles',
      '에스라': 'ezra',
      '느헤미야': 'nehemiah',
      '에스더': 'esther',
      '욥기': 'job',
      '시편': 'psalms',
      '잠언': 'proverbs',
      '전도서': 'ecclesiastes',
      '아가': 'song_of_songs',
      '이사야': 'isaiah',
      '예레미야': 'jeremiah',
      '예레미야애가': 'lamentations',
      '에스겔': 'ezekiel',
      '다니엘': 'daniel',
      '호세아': 'hosea',
      '요엘': 'joel',
      '아모스': 'amos',
      '오바댜': 'obadiah',
      '요나': 'jonah',
      '미가': 'micah',
      '나훔': 'nahum',
      '하박국': 'habakkuk',
      '스바냐': 'zephaniah',
      '학개': 'haggai',
      '스가랴': 'zechariah',
      '말라기': 'malachi',
      '마태복음': 'matthew',
      '마가복음': 'mark',
      '누가복음': 'luke',
      '요한복음': 'john',
      '사도행전': 'acts',
      '로마서': 'romans',
      '고린도전서': 'first_corinthians',
      '고린도후서': 'second_corinthians',
      '갈라디아서': 'galatians',
      '에베소서': 'ephesians',
      '빌립보서': 'philippians',
      '골로새서': 'colossians',
      '데살로니가전서': 'first_thessalonians',
      '데살로니가후서': 'second_thessalonians',
      '디모데전서': 'first_timothy',
      '디모데후서': 'second_timothy',
      '디도서': 'titus',
      '빌레몬서': 'philemon',
      '히브리서': 'hebrews',
      '야고보서': 'james',
      '베드로전서': 'first_peter',
      '베드로후서': 'second_peter',
      '요한일서': 'first_john',
      '요한이서': 'second_john',
      '요한삼서': 'third_john',
      '유다서': 'jude',
      '요한계시록': 'revelation'
    }
    
    // 모든 성경책 데이터를 병렬로 로드
    const bookLoadPromises = Object.entries(bookFileMapping).map(async ([bookName, fileName]) => {
      try {
        const response = await fetch(`/db/hokma/${fileName}.json`)
        if (response.ok) {
          const bookData = await response.json()
          if (bookData && Array.isArray(bookData)) {
            return bookData
          }
        }
        return []
      } catch (bookError) {
        // 해당 성경책 파일이 없으면 빈 배열 반환
        console.log(`${bookName} (${fileName}) 데이터 파일이 없습니다.`)
        return []
      }
    })
    
    // 모든 성경책 데이터를 병렬로 로드하고 결과를 합침
    const bookDataArrays = await Promise.all(bookLoadPromises)
    const allCommentaryData = bookDataArrays.flat()
    
    commentaryData.value = allCommentaryData
    
    // 사용 가능한 성경책 목록 생성
    const books = [...new Set(commentaryData.value.map(item => item.book))]
    availableBooks.value = books
    console.log('호크마 주석 데이터 로드 완료:', commentaryData.value.length, '개')
    console.log('사용 가능한 성경책:', books)
    
    // 데이터 로드 완료 후 초기화
    initializeCommentarySelection()
  } catch (error) {
    console.error('호크마 주석 데이터 로드 실패:', error)
  } finally {
    loadingCommentaryData.value = false
  }
}

// 호크마 주석 초기 선택 설정
const initializeCommentarySelection = () => {
  if (commentaryData.value.length > 0) {
    // 저장된 상태 복원
    restoreCommentaryState()
    updateAvailableOptions()
    loadSelectedCommentary()
  }
}

// 필터링된 성경 요약 데이터
const filteredBibleData = computed(() => {
  if (!summarySearchTerm.value) {
    return bibleData.value
  }
  
  const search = summarySearchTerm.value.toLowerCase().trim()
  return bibleData.value.filter(book => 
    book.title.toLowerCase().includes(search)
  )
})

// 성경 요약 검색 초기화
const clearSummarySearch = () => {
  summarySearchTerm.value = ''
  // localStorage에서도 제거
  localStorage.removeItem('hokma_summary_search')
}

// 성경 요약 데이터 새로고침
const refreshSummaryData = async () => {
  summarySearchTerm.value = ''
  localStorage.removeItem('hokma_summary_search')
  await loadBibleData()
}

// 검색 상태 저장
const saveSearchState = () => {
  localStorage.setItem('hokma_summary_search', summarySearchTerm.value)
}

// 검색 상태 복원
const restoreSearchState = () => {
  const savedSearch = localStorage.getItem('hokma_summary_search')
  if (savedSearch) {
    summarySearchTerm.value = savedSearch
  } else {
    // 저장된 검색어가 없으면 기본값으로 창세기 설정
    summarySearchTerm.value = '창세기'
  }
}

// 검색어 변경 감지하여 자동 저장
watch(summarySearchTerm, (newValue) => {
  if (newValue) {
    saveSearchState()
  }
})

// 호크마 주석 상태 저장
const saveCommentaryState = () => {
  const state = {
    selectedBook: selectedBook.value,
    selectedChapter: selectedChapter.value,
    selectedVerse: selectedVerse.value
  }
  localStorage.setItem('hokma_commentary_state', JSON.stringify(state))
}

// 호크마 주석 상태 복원
const restoreCommentaryState = () => {
  const savedState = localStorage.getItem('hokma_commentary_state')
  if (savedState) {
    try {
      const state = JSON.parse(savedState)
      selectedBook.value = state.selectedBook || '창세기'
      selectedChapter.value = Number(state.selectedChapter ?? 1)
      selectedVerse.value = Number(state.selectedVerse ?? 1)
    } catch (error) {
      console.error('호크마 주석 상태 복원 실패:', error)
      // 기본값 설정
      selectedBook.value = '창세기'
      selectedChapter.value = 1
      selectedVerse.value = 1
    }
  } else {
    // 저장된 상태가 없으면 기본값 설정
    selectedBook.value = '창세기'
    selectedChapter.value = 1
    selectedVerse.value = 1
  }
}

// 호크마 주석 관련 함수들
const onBookChange = () => {
  selectedChapter.value = null
  selectedVerse.value = null
  selectedCommentary.value = null
  updateAvailableOptions()
  loadSelectedCommentary()
  saveCommentaryState() // 상태 저장
}

const onChapterChange = () => {
  selectedVerse.value = null
  selectedCommentary.value = null
  updateAvailableOptions()
  loadSelectedCommentary()
  saveCommentaryState() // 상태 저장
}

const onVerseChange = () => {
  loadSelectedCommentary()
  saveCommentaryState() // 상태 저장
}

// 사용 가능한 옵션 업데이트
const updateAvailableOptions = () => {
  if (!selectedBook.value) {
    availableChapters.value = []
    availableVerses.value = []
    return
  }

  // 장 목록 업데이트
  const chapters = [...new Set(
    commentaryData.value
      .filter(item => item.book === selectedBook.value)
      .map(item => item.chapter)
  )].sort((a, b) => a - b)
  
  availableChapters.value = chapters

  if (!selectedChapter.value) {
    availableVerses.value = []
    return
  }

  // 절 목록 업데이트
  const chapterNumber = Number(selectedChapter.value)
  const verses = [...new Set(
    commentaryData.value
      .filter(item => item.book === selectedBook.value && item.chapter === chapterNumber)
      .map(item => Number(item.verse))
  )].sort((a, b) => a - b)
  
  availableVerses.value = verses
}

// 선택된 주석 로드
const loadSelectedCommentary = () => {
  if (!selectedBook.value || !selectedChapter.value) {
    selectedCommentary.value = null
    return
  }

  // 절이 선택된 경우: 특정 절만 표시
  if (selectedVerse.value) {
    const commentary = commentaryData.value.find(item => 
      item.book === selectedBook.value && 
      item.chapter === Number(selectedChapter.value) && 
      item.verse === Number(selectedVerse.value)
    )
    selectedCommentary.value = commentary || null
  } else {
    // 절이 선택되지 않은 경우: 해당 장의 모든 절 표시
    const chapterCommentaries = commentaryData.value.filter(item => 
      item.book === selectedBook.value && 
      item.chapter === Number(selectedChapter.value)
    )
    selectedCommentary.value = chapterCommentaries.length > 0 ? chapterCommentaries : null
  }
}

// 주석 텍스트 포맷팅
const formatCommentaryText = (text) => {
  if (!text) return ''
  
  // '주)' 를 기준으로 개행 처리하고 볼드 처리
  let formattedText = text.replace(/주\)/g, '<br><br><strong>주)</strong>')
  
  // 첫 번째 '주)' 앞의 개행 제거
  formattedText = formattedText.replace(/^<br><br>/, '')
  
  // 기존 줄바꿈 처리
  formattedText = formattedText.replace(/\n/g, '<br>')
  
  return formattedText
}

// 테이블 헤더 추출 함수
const getTableHeaders = (tableData) => {
  if (!tableData || !Array.isArray(tableData) || tableData.length === 0) return []
  
  // 첫 번째 행의 값들을 헤더로 사용 (민수기 28:1 같은 경우)
  const firstRow = tableData[0]
  const firstRowValues = Object.values(firstRow)
  
  // 첫 번째 행의 모든 값이 동일한 키와 값인 경우 (헤더 행으로 판단)
  const isHeaderRow = Object.keys(firstRow).every(key => key === firstRow[key])
  
  if (isHeaderRow) {
    return firstRowValues
  } else {
    // 일반적인 경우: 첫 번째 행의 키들을 헤더로 사용
    return Object.keys(firstRow)
  }
}

// 테이블 데이터 행 추출 함수
const getTableRows = (tableData) => {
  if (!tableData || !Array.isArray(tableData) || tableData.length === 0) return []
  
  const firstRow = tableData[0]
  const isHeaderRow = Object.keys(firstRow).every(key => key === firstRow[key])
  
  if (isHeaderRow) {
    // 헤더 행이 있는 경우: 첫 번째 행을 제외한 나머지 행들 반환
    return tableData.slice(1)
  } else {
    // 일반적인 경우: 모든 행 반환
    return tableData
  }
}

// 테이블 제목 생성 함수
const getTableTitle = (tableKey) => {
  const titleMap = {
    'population_survey': '인구 조사',
    'survey_details': '조사 세부사항',
    'comparison': '비교표',
    'details': '세부사항',
    'summary': '요약',
    'analysis': '분석'
  }
  
  return titleMap[tableKey] || tableKey
}

// 탭 변경 시 초기화
watch(activeTab, (newTab) => {
  if (newTab === 'commentary') {
    if (commentaryData.value.length === 0) {
      // 데이터가 아직 로드되지 않은 경우에만 로딩 표시
      // (이미 백그라운드에서 로딩 중일 수 있음)
      if (!loadingCommentaryData.value) {
        loadingCommentaryData.value = true
        loadCommentaryData()
      }
    } else {
      // 이미 데이터가 있으면 상태 복원만 수행
      restoreCommentaryState()
      updateAvailableOptions()
      loadSelectedCommentary()
    }
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  max-width: none;
}

.prose strong {
  font-weight: 600;
  color: #1f2937;
}
</style>