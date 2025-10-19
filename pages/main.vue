<template>
  <div class="main-page min-h-screen">

    <!-- 메인 컨텐츠 -->
    <main class="w-full px-0 py-8 lg:container lg:mx-auto lg:max-w-7xl lg:px-4 flex-1">
      <div class="flex gap-6">
        <!-- 좌측 섹션 (50%) -->
        <section class="main-left-content flex-1">
        <!-- 좌측 말씀묵상 검색결과 영역 -->
        <div class="main-left-result-area">
          <!-- 말씀묵상 목록 (관리자) / 개인묵상 목록 (일반유저) -->
          <div class="bg-indigo-50 rounded-lg border border-gray-200 overflow-hidden mb-6 h-[536px]">
            <!-- 로딩 상태 -->
            <div v-if="loading" class="text-center py-12">
              <div class="flex flex-col items-center justify-center">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </div>
                <p class="text-gray-500">개인묵상 목록을 불러오는 중...</p>
              </div>
            </div>


            <!-- 묵상 목록 -->
            <div v-else-if="filteredMeditations.length > 0" class="bg-indigo-50 py-5">
              <div
                v-for="(meditation, index) in paginatedMeditations"
                :key="meditation.id"
                :class="[
                  'border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
                  index === paginatedMeditations.length - 1 ? 'border-b-0' : ''
                ]"
                @click="openMeditationModal(meditation)"
              >
                <div class="px-6 py-3">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                          <h3 class="text-md xl:text-lg font-semibold text-gray-900 line-clamp-1">{{ meditation.title }}</h3>
                        </div>
                      <p class="text-gray-600 text-md leading-relaxed mb-3 line-clamp-1">
                        {{ meditation.body }}
                      </p>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <span class="text-md text-gray-500">{{ meditation.createdAt }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 데이터가 없을 때 -->
            <div v-else class="text-center py-12 flex flex-col justify-center">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.515-.751-6.281-2.02M12 15c2.34 0 4.515-.751 6.281-2.02M12 3v12"></path>
                </svg>
              </div>
              <p class="text-gray-500">
                {{ isBibleSearchActive && selectedBook 
                  ? `"${selectedBook}${selectedChapter ? ` ${selectedChapter}장` : ''}"에 대한 검색 결과가 없습니다.` 
                  : '등록된 개인묵상이 없습니다.'
                }}
              </p>
              <div v-if="isBibleSearchActive && selectedBook" class="mt-4">
                <button 
                  @click="resetBibleSearch"
                  class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
                >
                  검색 초기화
                </button>
              </div>
            </div>
          </div>

          <!-- 페이지네이션 -->
          <div v-if="filteredMeditations.length > 0" class="flex justify-center">
            <nav class="flex items-center space-x-1">
              <!-- 이전 버튼 (10개 단위) -->
              <button 
                :disabled="currentPage <= 10"
                @click="goToPage(Math.max(1, currentPage - 10))"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors',
                  currentPage <= 10 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              
              <!-- 페이지 번호들 -->
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors border',
                  currentPage === page
                    ? 'bg-indigo-300 text-white border-indigo-300'
                    : 'text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800'
                ]"
              >
                {{ page }}
              </button>
              
              <!-- 다음 버튼 (10개 단위) -->
              <button 
                :disabled="currentPage >= totalPages - 9"
                @click="goToPage(Math.min(totalPages, currentPage + 10))"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors',
                  currentPage >= totalPages - 9 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </nav>
          </div>
        </div>

        <!-- 좌측 말씀묵상 검색 영역 -->
        <div class="main-left-search-area mt-15">
          <div class="bg-white rounded-lg">
            
            <!-- 검색창과 성경책 선택 -->
            <div class="px-6 py-4">
              <div class="flex items-center gap-4">   

               <!-- 검색영역 제목 -->
               <div class="px-6 py-3 xl:px-12 xl:py-4 bg-indigo-200 rounded">
                 <h3 class="text-base xl:text-lg font-semibold text-gray-800">
                   개인묵상
                 </h3>
               </div>
              
              <!-- 검색창 -->
              <div class="flex-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input 
                  v-model="meditationSearchTerm"
                  @keyup.enter="searchMeditations"
                  type="text" 
                  placeholder="Search"
                  class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-gray-200 focus:outline-none"
                />
              </div>
              
              <!-- 검색창 초기화 버튼 -->
              <button 
                @click="clearMeditationSearch"
                class="hidden xl:block px-6 py-3 bg-indigo-500 text-sm font-semibold text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                초기화
              </button>
              </div>
              
              <!-- 성경책 선택 옵션들 -->
              <div class="flex flex-col sm:flex-row gap-4 mt-6">
                <!-- 성경책과 성경장 선택 영역 -->
                <div class="flex gap-4 flex-1">
                  <!-- 성경책 선택 -->
                  <div class="w-1/2">
                    <label class="hidden xl:block text-sm font-medium text-gray-700 mb-2">성경책</label>
                    <div class="relative">
                      <select 
                        v-model="selectedBook"
                        @change="updateChapters"
                        class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:border-gray-300 focus:outline-none appearance-none"
                      >
                        <option value="">성경책 선택</option>
                        <option 
                          v-for="book in availableBooks" 
                          :key="book" 
                          :value="book"
                        >
                          {{ book }}
                        </option>
                      </select>
                      <!-- 드롭다운 화살표 아이콘 -->
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 성경장 선택 -->
                  <div class="w-1/2">
                    <label class="hidden xl:block text-sm font-medium text-gray-700 mb-2">성경장</label>
                    <div class="relative">
                      <select 
                        v-model="selectedChapter"
                        class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:border-gray-300 focus:outline-none appearance-none"
                        :disabled="!selectedBook"
                      >
                        <option value="">성경장 선택</option>
                        <option 
                          v-for="chapter in availableChapters" 
                          :key="chapter" 
                          :value="chapter"
                        >
                          {{ chapter }}장
                        </option>
                      </select>
                      <!-- 드롭다운 화살표 아이콘 -->
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 성경책 검색 및 초기화 버튼 -->
                <div class="flex items-end gap-2 sm:flex-shrink-0">
                  <button 
                    @click="searchByBibleSelection"
                    :disabled="!selectedBook"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-semibold transition-colors border h-10',
                      selectedBook
                        ? 'bg-indigo-500 text-white text-base border-indigo-500 hover:bg-indigo-600'
                        : 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                    ]"
                  >
                    묵상 검색
                  </button>
                  <button 
                    @click="resetBibleSearch"
                    :disabled="!selectedBook && !selectedChapter"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-semibold transition-colors border h-10',
                      (selectedBook || selectedChapter)
                        ? 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600'
                        : 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                    ]"
                  >
                    초기화
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

        <!-- 우측 섹션 (50%) -->
        <section class="main-right-content flex-1">
        <!-- 우측 블로그 검색결과 영역 -->
        <div class="main-right-result-area">
          <!-- 블로그 목록 -->
          <div class="bg-indigo-50 h-[536px] rounded-lg border border-gray-200 overflow-hidden mb-6">
            <!-- 로딩 상태 -->
            <div v-if="blogLoading || (selectedBlogCategory === '말씀안내' && guideLoading)" class="text-center py-12">
              <div class="flex flex-col items-center justify-center">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </div>
                <p class="text-gray-500">
                  {{ selectedBlogCategory === '말씀안내' ? '말씀안내 목록을 불러오는 중...' : '블로그 목록을 불러오는 중...' }}
                </p>
              </div>
            </div>

            <!-- 블로그 목록 -->
            <div v-else-if="displayBlogs.length > 0" class="bg-indigo-50 py-5">
              <div
                v-for="(blog, index) in paginatedBlogs"
                :key="blog.id"
                :class="[
                  'border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
                  index === paginatedBlogs.length - 1 ? 'border-b-0' : ''
                ]"
                @click="openBlogModal(blog)"
              >
                <div class="px-6 py-3">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center mb-2">
                        <!-- <span class="text-lg font-semibold text-gray-900 mr-3">{{ index + 1 + (blogCurrentPage - 1) * blogItemsPerPage }}.</span> -->
                        <h3 class="text-md xl:text-lg font-semibold text-gray-900">{{ blog.title }}</h3>
                      </div>
                      <p class="text-gray-600 text-md leading-relaxed mb-3 line-clamp-1">
                        {{ blog.body }}
                      </p>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <span class="text-sm text-gray-500">{{ blog.createdAt }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 데이터가 없을 때 -->
            <div v-else class="text-center py-12 flex flex-col justify-center">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.515-.751-6.281-2.02M12 15c2.34 0 4.515-.751 6.281-2.02M12 3v12"></path>
                </svg>
              </div>
              <p class="text-gray-500">
                {{ isBlogSearchActive && blogSearchTerm 
                  ? `"${blogSearchTerm}"에 대한 검색 결과가 없습니다.` 
                  : selectedBlogCategory && selectedBlogCategory !== '전체'
                    ? `"${selectedBlogCategory}" 카테고리에 등록된 블로그가 없습니다.`
                    : '등록된 블로그가 없습니다.' 
                }}
              </p>
              <div v-if="isBlogSearchActive && blogSearchTerm" class="mt-4">
                <button 
                  @click="resetBlogSearch"
                  class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
                >
                  검색 초기화
                </button>
              </div>
            </div>
          </div>

          <!-- 블로그 페이지네이션 -->
          <div v-if="displayBlogs.length > 0" class="flex justify-center">
            <nav class="flex items-center space-x-1">
              <!-- 이전 버튼 (10개 단위) -->
              <button 
                :disabled="blogCurrentPage <= 10"
                @click="goToBlogPage(Math.max(1, blogCurrentPage - 10))"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors',
                  blogCurrentPage <= 10 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              
              <!-- 페이지 번호들 -->
              <button
                v-for="page in blogVisiblePages"
                :key="page"
                @click="goToBlogPage(page)"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors border',
                  blogCurrentPage === page
                    ? 'bg-indigo-300 text-white border-indigo-300'
                    : 'text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800'
                ]"
              >
                {{ page }}
              </button>
              
              <!-- 다음 버튼 (10개 단위) -->
              <button 
                :disabled="blogCurrentPage >= blogTotalPages - 9"
                @click="goToBlogPage(Math.min(blogTotalPages, blogCurrentPage + 10))"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors',
                  blogCurrentPage >= blogTotalPages - 9 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </nav>
          </div>
        </div>

        <!-- 우측 블로그 검색 영역 -->
        <div class="main-right-search-area mt-15">
          <div class="bg-white rounded-lg">
            
            <!-- 검색창과 검색버튼 -->
            <div class="px-6 py-4">
              <div class="flex items-center gap-4">   
                <!-- 검색영역 제목 -->
                <div class="px-6 py-3 xl:px-12 xl:py-4 bg-indigo-200 rounded">
                  <h3 class="text-base xl:text-lg font-semibold text-gray-800">
                    블로그 검색
                  </h3>
                </div>
                
                <!-- 검색창 -->
                <div class="flex-1 relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input 
                    v-model="blogSearchTerm"
                    @keyup.enter="searchBlogs"
                    type="text" 
                    placeholder="Search"
                    class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-gray-200 focus:outline-none"
                  />
                </div>
                
                <!-- 검색창 초기화 버튼 -->
                <button 
                  @click="clearBlogSearch"
                  class="hidden xl:block px-6 py-3 bg-indigo-500 text-sm font-semibold text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  초기화
                </button>
              </div>
              
              <!-- 검색 옵션 라디오 버튼들 -->
              <div class="hidden xl:flex gap-4 mt-12 flex-wrap">
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="selectedBlogCategory" 
                    value="전체"
                    @change="searchBlogs"
                    class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:outline-none"
                    checked
                  >
                  <span class="ml-2 text-sm font-medium text-gray-700">전체</span>
                </label>
                
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="selectedBlogCategory" 
                    value="성서이해"
                    @change="searchBlogs"
                    class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:outline-none"
                  >
                  <span class="ml-2 text-sm font-medium text-gray-700">성서이해</span>
                </label>
                
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="selectedBlogCategory" 
                    value="성서마당"
                    @change="searchBlogs"
                    class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:outline-none"
                  >
                  <span class="ml-2 text-sm font-medium text-gray-700">성서마당</span>
                </label>
                
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="selectedBlogCategory" 
                    value="카페신학"
                    @change="searchBlogs"
                    class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:outline-none"
                  >
                  <span class="ml-2 text-sm font-medium text-gray-700">카페신학</span>
                </label>
                
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="selectedBlogCategory" 
                    value="신학레시피"
                    @change="searchBlogs"
                    class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:outline-none"
                  >
                  <span class="ml-2 text-sm font-medium text-gray-700">신학레시피</span>
                </label>
                
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="selectedBlogCategory" 
                    value="말씀새김"
                    @change="searchBlogs"
                    class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:outline-none"
                  >
                  <span class="ml-2 text-sm font-medium text-gray-700">말씀새김</span>
                </label>
                
                <!-- <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="selectedBlogCategory" 
                    value="말씀안내"
                    @change="searchBlogs"
                    class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:outline-none"
                  >
                  <span class="ml-2 text-sm font-medium text-gray-700">말씀안내</span>
                </label> -->
              </div>

               <!-- 검색 옵션 Select -->
               <div class="mt-6 xl:hidden">
                 <div class="relative">
                   <select 
                     v-model="selectedBlogCategory"
                     @change="searchBlogs"
                     class="w-full px-3 py-2 pr-8 border border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none appearance-none bg-white"
                   >
                     <option value="전체">전체</option>
                     <option value="성서이해">성서이해</option>
                     <option value="성서마당">성서마당</option>
                     <option value="카페신학">카페신학</option>
                     <option value="신학레시피">신학레시피</option>
                     <option value="말씀새김">말씀새김</option>
                     <option value="말씀안내">말씀안내</option>
                   </select>
                   <!-- 드롭다운 화살표 아이콘 -->
                   <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                     <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                     </svg>
                   </div>
                 </div>
               </div>

            </div>
            
          </div>
        </div>
      </section>
      </div>
    </main>

    <!-- 통합 배경 오버레이 -->
    <div v-if="modalOpen || blogModalOpen" class="fixed left-0 top-0 w-full h-full bg-black/0 z-30 pointer-events-none"></div>

    <!-- 묵상 상세 모달 -->
    <div v-if="modalOpen" class="fixed left-3 top-[-5px] w-full lg:w-1/2 h-full flex items-center justify-center z-50 p-4 pointer-events-auto lg:left-3 left-0">
      <div class="bg-white rounded-lg shadow-xl w-full h-full max-h-[calc(98dvh-150px)] overflow-y-auto flex flex-col border border-gray-200">
        <!-- 모달 헤더 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <div class="flex-1 pr-4">
            <!-- 제목 (편집 가능) -->
            <input 
              v-model="editTitle"
              class="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50"
              placeholder="묵상 제목을 입력하세요"
            >
          </div>
          <div class="flex items-center space-x-4 flex-shrink-0">
            <span class="text-sm text-gray-500">{{ selectedMeditation.createdAt }}</span>
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

        <!-- 묵상 내용 영역 (스크롤 가능) -->
        <div class="p-6 pb-0">
          <div class="mb-6">
            <label class="block text-base font-bold text-gray-700 mb-2">묵상 내용</label>
            <textarea 
              v-model="editBody"
              rows="12"
              class="w-full h-[540px] text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50 overflow-y-auto"
              placeholder="묵상 내용을 입력하세요"
            ></textarea>
          </div>
        </div>

        <!-- 성경 구절과 기도 제목 영역 -->
        <div class="p-6">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- 성경 구절 (편집 가능) -->
            <div class="flex-1">
              <label class="block text-base font-bold text-gray-700 mb-2">성경 구절</label>
              <input 
                v-model="editReference"
                class="w-full text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50"
                placeholder="성경 구절을 입력하세요"
              >
            </div>

            <!-- 기도 제목 (편집 가능) -->
            <div class="flex-1">
              <label class="block text-base font-bold text-gray-700 mb-2">기도 제목</label>
              <textarea 
                v-model="editPrayer"
                rows="2"
                class="w-full h-[50px] text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50 overflow-y-auto"
                placeholder="기도 제목을 입력하세요"
              ></textarea>
            </div>
          </div>
        </div>

         <!-- 모달 하단 -->
         <div class="p-6 border-t border-gray-200">

           <!-- 메타 정보 -->
           <div class="mb-4">
             <div class="flex flex-wrap gap-3 justify-center">
               <div class="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full text-sm font-medium">
                 {{ editReference || '성경 구절' }}
               </div>
               <div class="bg-gray-100 text-gray-800 px-3 py-2 rounded-full text-sm font-medium">
                 {{ editAuthor || '작성자' }}
               </div>
             </div>
           </div>

           <!-- 버튼 그룹 -->
           <div class="flex justify-center space-x-4 mt-10">
             <!-- 현재 사용자가 작성한 글인 경우에만 수정 버튼 표시 -->
             <button
               v-if="isCurrentUserAuthor"
               @click="updateMeditation"
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
             
             <!-- 현재 사용자가 작성한 글인 경우에만 삭제 버튼 표시 -->
             <button
               v-if="isCurrentUserAuthor"
               @click="deleteMeditation"
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
             
             <!-- 모든 사용자에게 창닫기 버튼 표시 -->
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

    <!-- 블로그 상세 모달 -->
    <div v-if="blogModalOpen" class="fixed right-3 top-[-5px] w-full lg:w-1/2 h-full flex items-center justify-center z-50 p-4 pointer-events-auto lg:right-3 right-0">
      <div class="bg-white rounded-lg shadow-xl w-full h-full max-h-[calc(98dvh-150px)] overflow-y-auto flex flex-col border border-gray-200">
        <!-- 모달 헤더 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <div class="flex-1 pr-4">
            <!-- 제목 (편집 가능) -->
            <input 
              v-model="editBlogTitle"
              class="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50"
              placeholder="블로그 제목을 입력하세요"
            >
          </div>
          <div class="flex items-center space-x-4 flex-shrink-0">
            <span class="text-sm text-gray-500">{{ selectedBlog.createdAt }}</span>
            <button 
              @click="closeBlogModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 블로그 내용 영역 (스크롤 가능) -->
        <div class="p-6 pb-0">
          <div class="mb-6">
            <label class="block text-base font-bold text-gray-700 mb-2">블로그 내용</label>
            <textarea 
              v-model="editBlogBody"
              rows="12"
              class="w-full h-[540px] text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50 overflow-y-auto"
              placeholder="블로그 내용을 입력하세요"
            ></textarea>
          </div>
        </div>

        <!-- 카테고리와 작성자 영역 -->
        <div class="p-6">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- 카테고리 (편집 가능) -->
            <div class="flex-1">
              <label class="block text-base font-bold text-gray-700 mb-2">카테고리</label>
              <input 
                v-model="editBlogCategory"
                class="w-full text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50"
                placeholder="카테고리를 입력하세요"
              >
            </div>

            <!-- 작성자 (편집 가능) -->
            <div class="flex-1">
              <label class="block text-base font-bold text-gray-700 mb-2">작성자</label>
              <textarea 
                v-model="editBlogAuthor"
                rows="2"
                class="w-full h-[50px] text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50 overflow-y-auto"
                placeholder="작성자를 입력하세요"
              ></textarea>
            </div>
          </div>
        </div>

         <!-- 모달 하단 -->
         <div class="p-6 border-t border-gray-200">

           <!-- 메타 정보 -->
           <div class="mb-4">
             <div class="flex flex-wrap gap-3 justify-center">
               <div class="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full text-sm font-medium">
                 {{ editBlogCategory || '카테고리' }}
               </div>
               <div class="bg-gray-100 text-gray-800 px-3 py-2 rounded-full text-sm font-medium">
                 {{ editBlogAuthor || '작성자' }}
               </div>
             </div>
           </div>

           <!-- 버튼 그룹 -->
           <div class="flex justify-center space-x-4 mt-10">
             <!-- 관리자만 수정 버튼 표시 -->
             <button
               v-if="role === 'admin'"
               @click="updateBlog"
               :disabled="blogUpdating"
               class="w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center sm:space-x-2 cursor-pointer"
             >
               <svg v-if="blogUpdating" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
               </svg>
               <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
               </svg>
               <span class="hidden sm:inline sm:ml-2">{{ blogUpdating ? '수정 중...' : '수정' }}</span>
             </button>
             
             <!-- 관리자만 삭제 버튼 표시 -->
             <button
               v-if="role === 'admin'"
               @click="deleteBlog"
               :disabled="blogDeleting"
               class="w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center sm:space-x-2 cursor-pointer"
             >
               <svg v-if="blogDeleting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
               </svg>
               <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
               </svg>
               <span class="hidden sm:inline sm:ml-2">{{ blogDeleting ? '삭제 중...' : '삭제' }}</span>
             </button>
             
             <!-- 모든 사용자에게 창닫기 버튼 표시 -->
             <button
               @click="closeBlogModal"
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
// 페이지 메타 설정
definePageMeta({
  middleware: 'auth' // auth middleware 명시적 적용
})

useHead({
  title: 'Bible Story | 메인',
  meta: [
    { name: 'description', content: 'Bible Story 메인 페이지' }
  ]
})

// Firebase 인증 스토어 사용
const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)
const role = computed(() => authStore.currentUserRole)

// 묵상 데이터 관련
const meditations = ref([])
const loading = ref(true)
const modalOpen = ref(false)
const selectedMeditation = ref({})

// 블로그 데이터 관련
const blogs = ref([])
const blogLoading = ref(true)
const blogModalOpen = ref(false)
const selectedBlog = ref({})

// 말씀안내 데이터 관련
const guides = ref([])
const guideLoading = ref(false)

// 모달 편집 관련 변수들
const editTitle = ref('')
const editBody = ref('')
const editReference = ref('')
const editPrayer = ref('')
const editAuthor = ref('')
const updating = ref(false)
const deleting = ref(false)

// 블로그 모달 편집 관련 변수들
const editBlogTitle = ref('')
const editBlogBody = ref('')
const editBlogCategory = ref('')
const editBlogAuthor = ref('')
const blogUpdating = ref(false)
const blogDeleting = ref(false)

// 페이지네이션 관련
const currentPage = ref(1)
const itemsPerPage = ref(5) // 한 페이지당 5개 목록

// 묵상 검색 관련
const meditationSearchTerm = ref('')

// 성경책 선택 관련
const selectedBook = ref('')
const selectedChapter = ref('')
const bibleData = ref([])
const availableBooks = ref([])
const availableChapters = ref([])
const isBibleSearchActive = ref(false) // 성경 검색 활성화 상태


// 블로그 페이지네이션 관련
const blogCurrentPage = ref(1)
const blogItemsPerPage = ref(5) // 한 페이지당 5개 목록

// 블로그 검색 관련
const blogSearchTerm = ref('')
const selectedBlogCategory = ref('전체') // 기본값을 '전체'로 설정
const filteredBlogs = ref([])
const isBlogSearchActive = ref(false)


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
      month: 'numeric',
      day: 'numeric'
    })
  } catch (error) {
    console.error('날짜 변환 오류:', error)
    return '날짜 오류'
  }
}



// Firebase에서 묵상 데이터 가져오기
const loadMeditationsFromFirebase = async () => {
  try {
    loading.value = true
    
    // Firebase에서 데이터 가져오기
    const { $db } = useNuxtApp()
    const { collection, getDocs, query, where } = await import('firebase/firestore')
    
    // qt 컬렉션에서 본인이 작성한 글만 가져오기
    const meditationsCollection = collection($db, 'qt')
    const currentUserName = user.value?.displayName || '익명'
    const q = query(meditationsCollection, where('author', '==', currentUserName))
    
    const querySnapshot = await getDocs(q)
    const rawMeditations = querySnapshot.docs.map(doc => {
      const data = doc.data()
      
      return {
        id: doc.id,
        title: data.title || '',
        body: data.body || '',
        reference: data.reference || '',
        prayer: data.prayer || '',
        author: data.author || '',
        createdAt: formatFirebaseDate(data.createdAt),
        createdAtRaw: data.createdAt // 정렬을 위한 원본 데이터
      }
    })
    
    // 작성날짜 기준 내림차순 정렬 (최근 작성된 순서)
    meditations.value = rawMeditations.sort((a, b) => {
      // 작성날짜 기준 내림차순 정렬 (최근 것부터)
      if (a.createdAtRaw && b.createdAtRaw) {
        let dateA, dateB
        
        // Firebase Timestamp 비교
        if (a.createdAtRaw.toDate && b.createdAtRaw.toDate) {
          dateA = a.createdAtRaw.toDate()
          dateB = b.createdAtRaw.toDate()
        } else if (a.createdAtRaw instanceof Date && b.createdAtRaw instanceof Date) {
          dateA = a.createdAtRaw
          dateB = b.createdAtRaw
        } else {
          dateA = new Date(a.createdAtRaw)
          dateB = new Date(b.createdAtRaw)
        }
        
        return dateB - dateA // 내림차순 (최근 것부터)
      }
      
      // 날짜가 없는 경우 맨 뒤로
      if (!a.createdAtRaw && !b.createdAtRaw) return 0
      if (!a.createdAtRaw) return 1
      if (!b.createdAtRaw) return -1
      
      return 0
    })
    
  } catch (error) {
    console.error('묵상 데이터 로드 실패:', error)
    
    // 에러 발생시 빈 배열로 초기화
    meditations.value = []
  } finally {
    loading.value = false
  }
}

// Firebase에서 블로그 데이터 가져오기
const loadBlogsFromFirebase = async () => {
  try {
    blogLoading.value = true
    
    // Firebase에서 데이터 가져오기
    const { $db } = useNuxtApp()
    const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
    
    const blogsCollection = collection($db, 'blogs')
    const q = query(blogsCollection) // orderBy 제거하여 인덱스 문제 해결
    
    const querySnapshot = await getDocs(q)
    const rawBlogs = querySnapshot.docs.map(doc => {
      const data = doc.data()
      
      // 다양한 날짜 필드명 확인
      const dateField = data.createdAt || data.createAt || data.date || data.timestamp
      
      return {
        id: doc.id,
        title: data.title || '',
        body: data.body || '',
        category: data.category || '',
        author: data.author || '',
        createdAt: dateField ? formatFirebaseDate(dateField) : '날짜 없음',
        createdAtRaw: dateField // 정렬을 위한 원본 데이터
      }
    })
    
    // 작성날짜 기준 내림차순 정렬 (최근 작성된 순서)
    blogs.value = rawBlogs.sort((a, b) => {
      // 작성날짜 기준 내림차순 정렬 (최근 것부터)
      if (a.createdAtRaw && b.createdAtRaw) {
        // Firebase Timestamp 비교
        if (a.createdAtRaw.toDate && b.createdAtRaw.toDate) {
          return b.createdAtRaw.toDate() - a.createdAtRaw.toDate()
        }
        
        // 일반 Date 객체 비교
        if (a.createdAtRaw instanceof Date && b.createdAtRaw instanceof Date) {
          return b.createdAtRaw - a.createdAtRaw
        }
        
        // 문자열 비교 (fallback)
        return new Date(b.createdAtRaw) - new Date(a.createdAtRaw)
      }
      
      // 날짜가 없는 경우 맨 뒤로
      if (!a.createdAtRaw && !b.createdAtRaw) return 0
      if (!a.createdAtRaw) return 1
      if (!b.createdAtRaw) return -1
      
      return 0
    })    
    
  } catch (error) {
    console.error('블로그 데이터 로드 실패:', error)
    
    // 에러 발생시 빈 배열로 초기화
    blogs.value = []
  } finally {
    blogLoading.value = false
  }
}

// Firebase에서 말씀안내 데이터 가져오기
const loadGuidesFromFirebase = async () => {
  try {
    guideLoading.value = true
    
    // Firebase에서 데이터 가져오기
    const { $db } = useNuxtApp()
    const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
    
    const guidesCollection = collection($db, 'guide')
    const q = query(guidesCollection) // orderBy 제거하여 인덱스 문제 해결
    
    const querySnapshot = await getDocs(q)
    const rawGuides = querySnapshot.docs.map(doc => {
      const data = doc.data()
      
      // 다양한 날짜 필드명 확인
      const dateField = data.createdAt || data.createAt || data.date || data.timestamp
      
      return {
        id: doc.id,
        title: data.title || '',
        body: data.body || '',
        category: '말씀안내', // 고정 카테고리
        author: data.author || '',
        createdAt: dateField ? formatFirebaseDate(dateField) : '날짜 없음',
        createdAtRaw: dateField // 정렬을 위한 원본 데이터
      }
    })
    
    // 작성날짜 기준 내림차순 정렬 (최근 작성된 순서)
    guides.value = rawGuides.sort((a, b) => {
      // 작성날짜 기준 내림차순 정렬 (최근 것부터)
      if (a.createdAtRaw && b.createdAtRaw) {
        // Firebase Timestamp 비교
        if (a.createdAtRaw.toDate && b.createdAtRaw.toDate) {
          return b.createdAtRaw.toDate() - a.createdAtRaw.toDate()
        }
        
        // 일반 Date 객체 비교
        if (a.createdAtRaw instanceof Date && b.createdAtRaw instanceof Date) {
          return b.createdAtRaw - a.createdAtRaw
        }
        
        // 문자열 비교 (fallback)
        return new Date(b.createdAtRaw) - new Date(a.createdAtRaw)
      }
      
      // 날짜가 없는 경우 맨 뒤로
      if (!a.createdAtRaw && !b.createdAtRaw) return 0
      if (!a.createdAtRaw) return 1
      if (!b.createdAtRaw) return -1
      
      return 0
    })    
    
  } catch (error) {
    console.error('말씀안내 데이터 로드 실패:', error)
    
    // 에러 발생시 빈 배열로 초기화
    guides.value = []
  } finally {
    guideLoading.value = false
  }
}



// 현재 사용자가 선택된 묵상의 작성자인지 확인
const isCurrentUserAuthor = computed(() => {
  if (!selectedMeditation.value || !user.value) return false
  const currentUserName = user.value.displayName || '익명'
  return selectedMeditation.value.author === currentUserName
})

// 필터링된 묵상 목록 (검색 기능 포함)
const filteredMeditations = computed(() => {
  let result = meditations.value

  // 성경책/장 검색 (우선순위 높음)
  if (isBibleSearchActive.value && selectedBook.value) {
    const bookName = selectedBook.value
    const chapterNumber = selectedChapter.value
    
    result = result.filter(meditation => {
      const title = meditation.title || ''
      const reference = meditation.reference || ''
      const body = meditation.body || ''
      
      // title, reference, body에서 모두 검색
      const searchText = `${title} ${reference} ${body}`
      
      // 성경책명이 포함되어 있는지 확인
      if (!searchText.includes(bookName)) {
        return false
      }
      
      // 성경장이 선택되었을 경우 추가 검증
      if (chapterNumber) {
        // 다양한 형식 패턴 지원:
        // 1. "출애굽기 1:1" (공백 + 콜론)
        // 2. "출애굽기1:1" (공백 없음 + 콜론)
        // 3. "출애굽기 1장" (공백 + 장)
        // 4. "출애굽기1장" (공백 없음 + 장)
        const patterns = [
          `${bookName} ${chapterNumber}:`,    // "출애굽기 1:"
          `${bookName}${chapterNumber}:`,     // "출애굽기1:"
          `${bookName} ${chapterNumber}장`,   // "출애굽기 1장"
          `${bookName}${chapterNumber}장`,    // "출애굽기1장"
        ]
        
        return patterns.some(pattern => searchText.includes(pattern))
      }
      
      return true // 성경책명만 일치하는 경우
    })
  }
  // 텍스트 검색 (성경 검색이 비활성화된 경우만)
  else if (meditationSearchTerm.value) {
    const searchTerm = meditationSearchTerm.value.trim()
    
    // 성경 구절 패턴 인식: "요한복음 1:1" 또는 "창세기 3:16" 형식
    const bibleRefPattern = /^(.+?)\s*(\d+):(\d+)$/
    const match = searchTerm.match(bibleRefPattern)
    
    if (match) {
      // 성경 구절 패턴이 감지된 경우
      const bookName = match[1].trim()
      const chapter = match[2]
      const verse = match[3]
      
      result = result.filter(meditation => {
        const title = meditation.title || ''
        const body = meditation.body || ''
        
        // 다양한 형식 매칭:
        // 1. "요한복음 1:1" 형식
        // 2. "요한복음 1장 1절" 형식
        // 3. "요한복음1:1" 형식 (공백 없음)
        const pattern1 = `${bookName} ${chapter}:${verse}`
        const pattern2 = `${bookName} ${chapter}장 ${verse}절`
        const pattern3 = `${bookName}${chapter}:${verse}`
        const pattern4 = `${bookName} ${chapter}장${verse}절`
        
        return title.includes(pattern1) || 
               title.includes(pattern2) || 
               title.includes(pattern3) ||
               title.includes(pattern4) ||
               body.includes(pattern1) || 
               body.includes(pattern2) ||
               body.includes(pattern3) ||
               body.includes(pattern4)
      })
    } else {
      // 일반 텍스트 검색
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(meditation => 
        meditation.title.toLowerCase().includes(lowerSearchTerm) ||
        meditation.body.toLowerCase().includes(lowerSearchTerm)
      )
    }
  }

  return result
})

// 페이지네이션 계산
const totalPages = computed(() => Math.ceil(filteredMeditations.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

// 현재 페이지의 묵상 목록
const paginatedMeditations = computed(() => {
  return filteredMeditations.value.slice(startIndex.value, endIndex.value)
})

// 페이지네이션 표시용 페이지 번호들 (최대 10개 표시)
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 10 // 최대 10개 페이지 번호 표시
  const halfVisible = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, currentPage.value - halfVisible)
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  // 끝에서 시작점 조정
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 필터링된 블로그 목록 (검색 기능 포함)
const displayBlogs = computed(() => {
  let result = []

  // 말씀안내가 선택된 경우에만 guides 데이터 사용
  if (selectedBlogCategory.value === '말씀안내') {
    result = guides.value
  } else {
    // 그 외의 경우 (전체 포함) blogs 데이터만 사용
    result = blogs.value
  }

  // 검색어가 있는 경우
  if (isBlogSearchActive.value && blogSearchTerm.value) {
    const searchTerm = blogSearchTerm.value.toLowerCase()
    
    result = result.filter(blog => {
      const title = blog.title || ''
      let titleMatches = false
      
      // 번호 검색인지 확인 (숫자로 시작하는 경우)
      if (/^\d+/.test(searchTerm)) {
        // 제목 맨 앞쪽의 번호 패턴 확인 (예: "623. 이사야 5:1-7절"에서 "623" 검색)
        const numberPattern = new RegExp(`^${searchTerm}\\.\\s*`, 'i')
        titleMatches = numberPattern.test(title)
      } else {
        // 단어 검색인 경우 제목 전체에서 검색
        titleMatches = title.toLowerCase().includes(searchTerm)
      }
      
      // 카테고리가 선택된 경우 ('전체'가 아닌 경우만 필터링)
      if (selectedBlogCategory.value && selectedBlogCategory.value !== '전체') {
        // 제목에 검색어가 포함되어 있고, 카테고리가 일치하는지 확인
        return titleMatches && blog.category === selectedBlogCategory.value
      } else {
        // '전체' 선택이거나 카테고리 선택 없이 제목에 검색어가 포함된 경우
        return titleMatches
      }
    })
  }
  // 카테고리만 선택된 경우 ('전체'가 아닌 경우만 필터링)
  else if (selectedBlogCategory.value && selectedBlogCategory.value !== '전체') {
    result = result.filter(blog => blog.category === selectedBlogCategory.value)
  }

  return result
})

// 블로그 페이지네이션 계산
const blogTotalPages = computed(() => Math.ceil(displayBlogs.value.length / blogItemsPerPage.value))
const blogStartIndex = computed(() => (blogCurrentPage.value - 1) * blogItemsPerPage.value)
const blogEndIndex = computed(() => blogStartIndex.value + blogItemsPerPage.value)

// 현재 페이지의 블로그 목록
const paginatedBlogs = computed(() => {
  return displayBlogs.value.slice(blogStartIndex.value, blogEndIndex.value)
})

// 블로그 페이지네이션 표시용 페이지 번호들 (최대 10개 표시)
const blogVisiblePages = computed(() => {
  const pages = []
  const maxVisible = 10 // 최대 10개 페이지 번호 표시
  const halfVisible = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, blogCurrentPage.value - halfVisible)
  let end = Math.min(blogTotalPages.value, start + maxVisible - 1)
  
  // 끝에서 시작점 조정
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

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


// 성경책 표준 순서 (구약 39권 + 신약 27권)
const bibleBookOrder = [
  // 구약 성경 (39권)
  '창세기', '출애굽기', '레위기', '민수기', '신명기', '여호수아', '사사기', '룻기', '사무엘상', '사무엘하',
  '열왕기상', '열왕기하', '역대상', '역대하', '에스라', '느헤미야', '에스더', '욥기', '시편', '잠언',
  '전도서', '아가', '이사야', '예레미야', '예레미야애가', '에스겔', '다니엘', '호세아', '요엘', '아모스',
  '오바댜', '요나', '미가', '나훔', '하박국', '스바냐', '학개', '스가랴', '말라기',
  // 신약 성경 (27권)
  '마태복음', '마가복음', '누가복음', '요한복음', '사도행전', '로마서', '고린도전서', '고린도후서',
  '갈라디아서', '에베소서', '빌립보서', '골로새서', '데살로니가전서', '데살로니가후서', '디모데전서',
  '디모데후서', '디도서', '빌레몬서', '히브리서', '야고보서', '베드로전서', '베드로후서', '요한일서',
  '요한이서', '요한삼서', '유다서', '요한계시록'
]

// 성경책 데이터 로드 함수
const loadBibleData = async () => {
  try {
    const response = await fetch('/db/bible_index.json')
    bibleData.value = await response.json()
    
    // 중복 제거하여 성경책 목록 생성
    const booksSet = new Set()
    bibleData.value.forEach(item => {
      booksSet.add(item.book)
    })
    
    // 성경책 표준 순서에 따라 정렬
    availableBooks.value = bibleBookOrder.filter(book => booksSet.has(book))

  } catch (error) {
    console.error('성경책 데이터 로드 실패:', error)
  }
}

// 성경책 변경 시 해당 성경책의 장 목록 업데이트
const updateChapters = () => {
  if (!selectedBook.value) {
    availableChapters.value = []
    selectedChapter.value = ''
    return
  }
  
  // 선택된 성경책의 장 목록 생성
  const chaptersSet = new Set()
  bibleData.value
    .filter(item => item.book === selectedBook.value)
    .forEach(item => {
      chaptersSet.add(item.chapter)
    })
  
  availableChapters.value = Array.from(chaptersSet).sort((a, b) => a - b)
  selectedChapter.value = '' // 장 선택 초기화
}

// 성경책/장 검색 함수
const searchByBibleSelection = () => {
  if (!selectedBook.value) return
  
  isBibleSearchActive.value = true
  meditationSearchTerm.value = '' // 텍스트 검색어 초기화
  currentPage.value = 1 // 첫 페이지로 이동
  
}

// 성경 검색 초기화 함수
const resetBibleSearch = () => {
  isBibleSearchActive.value = false
  selectedBook.value = ''
  selectedChapter.value = ''
  availableChapters.value = []
}

// 묵상 검색 관련 함수들

const searchMeditations = () => {
  // 검색어가 있으면 검색 실행
  if (meditationSearchTerm.value) {
    isBibleSearchActive.value = false // 성경 검색 초기화
    currentPage.value = 1 // 첫 페이지로 이동
  }
}

// 묵상 검색창 초기화 함수
const clearMeditationSearch = () => {
  meditationSearchTerm.value = ''
  isBibleSearchActive.value = false
  currentPage.value = 1
}

// 블로그 검색 함수
const searchBlogs = async () => {
  if (blogSearchTerm.value) {
    isBlogSearchActive.value = true
    blogCurrentPage.value = 1 // 첫 페이지로 이동
    
  } else if (selectedBlogCategory.value) {
    // 검색어는 없지만 카테고리가 선택된 경우
    isBlogSearchActive.value = false
    blogCurrentPage.value = 1
    
    // 말씀안내가 선택된 경우 guide 데이터 로드
    if (selectedBlogCategory.value === '말씀안내') {
      await loadGuidesFromFirebase()
    }
  } else {
    // 검색어와 카테고리 모두 없는 경우 초기화
    isBlogSearchActive.value = false
    blogCurrentPage.value = 1
  }
}

// 블로그 검색 초기화 함수
const resetBlogSearch = () => {
  isBlogSearchActive.value = false
  blogSearchTerm.value = ''
  selectedBlogCategory.value = '전체' // 기본값으로 초기화
  blogCurrentPage.value = 1
}

// 블로그 검색창 초기화 함수
const clearBlogSearch = () => {
  blogSearchTerm.value = ''
  isBlogSearchActive.value = false
  blogCurrentPage.value = 1
}

// 모달 열기
const openMeditationModal = (meditation) => {
  selectedMeditation.value = meditation
  editTitle.value = meditation.title
  editBody.value = meditation.body
  editReference.value = meditation.reference
  editPrayer.value = meditation.prayer
  editAuthor.value = meditation.author
  modalOpen.value = true
}

// 모달 닫기
const closeModal = () => {
  modalOpen.value = false
  selectedMeditation.value = {}
  editTitle.value = ''
  editBody.value = ''
  editReference.value = ''
  editPrayer.value = ''
  editAuthor.value = ''
  updating.value = false
  deleting.value = false
}

// 페이지 이동
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 블로그 페이지 이동
const goToBlogPage = (page) => {
  if (page >= 1 && page <= blogTotalPages.value) {
    blogCurrentPage.value = page
  }
}

// 묵상 수정 함수
const updateMeditation = async () => {
  if (!selectedMeditation.value.id) return
  
  // 권한 체크: 현재 사용자가 작성한 글인지 확인
  if (!isCurrentUserAuthor.value) {
    alert('본인이 작성한 글만 수정할 수 있습니다.')
    return
  }
  
  try {
    updating.value = true
    
    const { $db } = useNuxtApp()
    const { doc, updateDoc } = await import('firebase/firestore')
    
    // qt 컬렉션 사용
    const meditationDoc = doc($db, 'qt', selectedMeditation.value.id)
    await updateDoc(meditationDoc, {
      title: editTitle.value,
      body: editBody.value,
      reference: editReference.value,
      prayer: editPrayer.value,
      author: editAuthor.value
    })
    
    // 로컬 데이터 업데이트
    const meditationIndex = meditations.value.findIndex(meditation => meditation.id === selectedMeditation.value.id)
    if (meditationIndex !== -1) {
      meditations.value[meditationIndex] = {
        ...meditations.value[meditationIndex],
        title: editTitle.value,
        body: editBody.value,
        reference: editReference.value,
        prayer: editPrayer.value,
        author: editAuthor.value
      }
    }
    
    // 선택된 묵상도 업데이트
    selectedMeditation.value = {
      ...selectedMeditation.value,
      title: editTitle.value,
      body: editBody.value,
      reference: editReference.value,
      prayer: editPrayer.value,
      author: editAuthor.value
    }
    
    console.log('묵상 수정 완료')
    alert('묵상이 성공적으로 수정되었습니다.')
    
  } catch (error) {
    console.error('묵상 수정 실패:', error)
    alert('묵상 수정 중 오류가 발생했습니다.')
  } finally {
    updating.value = false
  }
}

// 묵상 삭제 함수
const deleteMeditation = async () => {
  if (!selectedMeditation.value.id) return
  
  // 권한 체크: 현재 사용자가 작성한 글인지 확인
  if (!isCurrentUserAuthor.value) {
    alert('본인이 작성한 글만 삭제할 수 있습니다.')
    return
  }
  
  if (!confirm('정말로 이 묵상을 삭제하시겠습니까?')) {
    return
  }
  
  try {
    deleting.value = true
    
    const { $db } = useNuxtApp()
    const { doc, deleteDoc } = await import('firebase/firestore')
    
    // qt 컬렉션 사용
    const meditationDoc = doc($db, 'qt', selectedMeditation.value.id)
    await deleteDoc(meditationDoc)
    
    // 로컬 데이터에서 제거
    meditations.value = meditations.value.filter(meditation => meditation.id !== selectedMeditation.value.id)
    
    console.log('묵상 삭제 완료')
    alert('묵상이 성공적으로 삭제되었습니다.')
    
    // 모달 닫기
    closeModal()
    
  } catch (error) {
    console.error('묵상 삭제 실패:', error)
    alert('묵상 삭제 중 오류가 발생했습니다.')
  } finally {
    deleting.value = false
  }
}

// 블로그 모달 열기
const openBlogModal = (blog) => {
  selectedBlog.value = blog
  editBlogTitle.value = blog.title
  editBlogBody.value = blog.body
  editBlogCategory.value = blog.category
  editBlogAuthor.value = blog.author
  blogModalOpen.value = true
}

// 블로그 모달 닫기
const closeBlogModal = () => {
  blogModalOpen.value = false
  selectedBlog.value = {}
  editBlogTitle.value = ''
  editBlogBody.value = ''
  editBlogCategory.value = ''
  editBlogAuthor.value = ''
  blogUpdating.value = false
  blogDeleting.value = false
}

// 블로그 수정 함수
const updateBlog = async () => {
  if (!selectedBlog.value.id) return
  
  try {
    blogUpdating.value = true
    
    const { $db } = useNuxtApp()
    const { doc, updateDoc } = await import('firebase/firestore')
    
    const blogDoc = doc($db, 'blogs', selectedBlog.value.id)
    await updateDoc(blogDoc, {
      title: editBlogTitle.value,
      body: editBlogBody.value,
      category: editBlogCategory.value,
      author: editBlogAuthor.value
    })
    
    // 로컬 데이터 업데이트
    const blogIndex = blogs.value.findIndex(blog => blog.id === selectedBlog.value.id)
    if (blogIndex !== -1) {
      blogs.value[blogIndex] = {
        ...blogs.value[blogIndex],
        title: editBlogTitle.value,
        body: editBlogBody.value,
        category: editBlogCategory.value,
        author: editBlogAuthor.value
      }
    }
    
    // 선택된 블로그도 업데이트
    selectedBlog.value = {
      ...selectedBlog.value,
      title: editBlogTitle.value,
      body: editBlogBody.value,
      category: editBlogCategory.value,
      author: editBlogAuthor.value
    }
    
    console.log('블로그 수정 완료')
    alert('블로그가 성공적으로 수정되었습니다.')
    
  } catch (error) {
    console.error('블로그 수정 실패:', error)
    alert('블로그 수정 중 오류가 발생했습니다.')
  } finally {
    blogUpdating.value = false
  }
}

// 블로그 삭제 함수
const deleteBlog = async () => {
  if (!selectedBlog.value.id) return
  
  if (!confirm('정말로 이 블로그를 삭제하시겠습니까?')) {
    return
  }
  
  try {
    blogDeleting.value = true
    
    const { $db } = useNuxtApp()
    const { doc, deleteDoc } = await import('firebase/firestore')
    
    const blogDoc = doc($db, 'blogs', selectedBlog.value.id)
    await deleteDoc(blogDoc)
    
    // 로컬 데이터에서 제거
    blogs.value = blogs.value.filter(blog => blog.id !== selectedBlog.value.id)
    
    console.log('블로그 삭제 완료')
    alert('블로그가 성공적으로 삭제되었습니다.')
    
    // 모달 닫기
    closeBlogModal()
    
  } catch (error) {
    console.error('블로그 삭제 실패:', error)
    alert('블로그 삭제 중 오류가 발생했습니다.')
  } finally {
    blogDeleting.value = false
  }
}

// 페이지 진입 시 데이터 로드
onMounted(async () => {  
  
  // 성경책 데이터 로드
  await loadBibleData()
  
  // 묵상 데이터 먼저 로드
  await loadMeditationsFromFirebase()
  
  // 블로그 데이터 로드 (별도로 실행하여 에러 확인)
  try {
    await loadBlogsFromFirebase()
  } catch (error) {
    console.error('블로그 로드 중 에러:', error)
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.main-left-content {
  flex: 1;
  min-width: 0; /* flex item이 축소될 수 있도록 */
}

.main-right-content {
  flex: 1;
  min-width: 0; /* flex item이 축소될 수 있도록 */
}

/* 페이지네이션 스타일 개선 */
nav button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 모달 애니메이션 */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 호버 효과 개선 */
.border-b:hover {
  background-color: #f9fafb;
  transition: background-color 0.2s ease;
}


/* 모바일 화면 스타일 */
@media (max-width: 960px) {
  /* 안쪽 스크롤바 제거 */
  .main-page {
    max-height: none !important;
    overflow-y: visible !important;
    min-height: 100vh !important;
  }
  
  main {
    display: block !important;
    width: 100%;
    padding: 40px 0;
  }
  
  /* 부모 컨테이너를 수직 배치로 변경 */
  main > div {
    flex-direction: column !important;
  }
  
  .main-left-content, .main-right-content {
    flex: none !important; /* flex-1 오버라이드 */
    width: 100% !important;
    display: block !important;
  }
  
  .main-left-result-area, .main-right-result-area {
    width: 100% !important;
    display: block !important;
  }
  
  /* 팝업창 폭을 100%로 변경 */
  .fixed.left-3.top-\[-5px\].w-full.lg\:w-1\/2,
  .fixed.right-3.top-\[-5px\].w-full.lg\:w-1\/2 {
    width: 100% !important;
    left: 0 !important;
    right: 0 !important;
    pointer-events: auto !important;
  }
  
  /* 통합 배경 오버레이 */
  .fixed.left-0.top-0.w-full {
    width: 100% !important;
    left: 0 !important;
    right: 0 !important;
    pointer-events: none !important;
  }
}



</style>
