<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <h1 class="text-[1.8rem] xl:text-3xl font-bold text-gray-800 mb-4">성경 개요</h1>
        <p class="text-gray-600">성경별 배경과 핵심 메시지를 쉽고 간단하게 이해할 수 있도록 안내하는 가이드 문서입니다.</p>
      </div>

      <!-- 스위칭 버튼 -->
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
            성경개요 목록
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
            성경개요 추가
          </button>
        </div>
      </div>

      <!-- 검색 영역 -->
      <div class="max-w-6xl mx-auto mb-8">
        <div class="flex items-center space-x-4">
          <!-- 검색창 (70% 폭) -->
          <div class="relative flex-1" style="width: 70%;">
            <input 
              v-model="searchTerm"
              type="text" 
              placeholder="성경개요 내용을 검색하세요..."
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
          
          <!-- 구약/신약 검색 버튼들 -->
          <div class="flex space-x-2" style="width: 30%;">
            <button
              @click="searchByTestament('구약')"
              :class="[
                'px-4 py-3 rounded-lg text-sm font-medium transition-colors flex-1 cursor-pointer',
                selectedTestament === '구약'
                  ? 'bg-indigo-300 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              구약성경
            </button>
            <button
              @click="searchByTestament('신약')"
              :class="[
                'px-4 py-3 rounded-lg text-sm font-medium transition-colors flex-1 cursor-pointer',
                selectedTestament === '신약'
                  ? 'bg-indigo-300 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              신약성경
            </button>
            <!-- <button
              v-if="selectedTestament"
              @click="clearTestamentSearch"
              class="px-3 py-3 rounded-lg text-sm font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors cursor-pointer"
              title="검색 초기화"
            >
              ✕
            </button> -->
          </div>
        </div>
      </div>

      <!-- 말씀 안내 폼 -->
      <div v-if="viewMode === 'add'" class="max-w-6xl mx-auto mb-8 border border-gray-200 rounded-lg">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">새 성경개요 추가</h2>
          
          <form @submit.prevent="addNewGuide" class="space-y-4">
            <!-- 성경개요 제목 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">성경개요 제목</label>
              <input 
                v-model="newGuide.title"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="성경개요 제목을 입력하세요"
              >
            </div>
            
            <!-- 성경개요 내용 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">성경개요 내용</label>
              <textarea 
                v-model="newGuide.body"
                required
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="성경개요 내용을 입력하세요"
              ></textarea>
            </div>
            
            <!-- 성경 책별 구분 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">성경 책별 구분</label>
              <div class="relative">
                <select 
                  v-model="newGuide.category"
                  required
                  class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">성경 책을 선택하세요</option>
                  <option value="창세기">창세기</option>
                  <option value="출애굽기">출애굽기</option>
                  <option value="레위기">레위기</option>
                  <option value="민수기">민수기</option>
                  <option value="신명기">신명기</option>
                  <option value="여호수아">여호수아</option>
                  <option value="사사기">사사기</option>
                  <option value="룻기">룻기</option>
                  <option value="사무엘상">사무엘상</option>
                  <option value="사무엘하">사무엘하</option>
                  <option value="열왕기상">열왕기상</option>
                  <option value="열왕기하">열왕기하</option>
                  <option value="역대상">역대상</option>
                  <option value="역대하">역대하</option>
                  <option value="에스라">에스라</option>
                  <option value="느헤미야">느헤미야</option>
                  <option value="에스더">에스더</option>
                  <option value="욥기">욥기</option>
                  <option value="시편">시편</option>
                  <option value="잠언">잠언</option>
                  <option value="전도서">전도서</option>
                  <option value="아가">아가</option>
                  <option value="이사야">이사야</option>
                  <option value="예레미야">예레미야</option>
                  <option value="예레미야애가">예레미야애가</option>
                  <option value="에스겔">에스겔</option>
                  <option value="다니엘">다니엘</option>
                  <option value="호세아">호세아</option>
                  <option value="요엘">요엘</option>
                  <option value="아모스">아모스</option>
                  <option value="오바댜">오바댜</option>
                  <option value="요나">요나</option>
                  <option value="미가">미가</option>
                  <option value="나훔">나훔</option>
                  <option value="하박국">하박국</option>
                  <option value="스바냐">스바냐</option>
                  <option value="학개">학개</option>
                  <option value="스가랴">스가랴</option>
                  <option value="말라기">말라기</option>
                  <option value="마태복음">마태복음</option>
                  <option value="마가복음">마가복음</option>
                  <option value="누가복음">누가복음</option>
                  <option value="요한복음">요한복음</option>
                  <option value="사도행전">사도행전</option>
                  <option value="로마서">로마서</option>
                  <option value="고린도전서">고린도전서</option>
                  <option value="고린도후서">고린도후서</option>
                  <option value="갈라디아서">갈라디아서</option>
                  <option value="에베소서">에베소서</option>
                  <option value="빌립보서">빌립보서</option>
                  <option value="골로새서">골로새서</option>
                  <option value="데살로니가전서">데살로니가전서</option>
                  <option value="데살로니가후서">데살로니가후서</option>
                  <option value="디모데전서">디모데전서</option>
                  <option value="디모데후서">디모데후서</option>
                  <option value="디도서">디도서</option>
                  <option value="빌레몬서">빌레몬서</option>
                  <option value="히브리서">히브리서</option>
                  <option value="야고보서">야고보서</option>
                  <option value="베드로전서">베드로전서</option>
                  <option value="베드로후서">베드로후서</option>
                  <option value="요한일서">요한일서</option>
                  <option value="요한이서">요한이서</option>
                  <option value="요한삼서">요한삼서</option>
                  <option value="유다서">유다서</option>
                  <option value="요한계시록">요한계시록</option>
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
                <span>{{ adding ? '추가 중...' : '성경개요 추가' }}</span>
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

      <!-- 성경개요 목록 (리스트 형식) -->
      <div v-else-if="viewMode === 'list'" class="max-w-6xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div
          v-for="(guide, index) in filteredGuides"
          :key="guide.id"
          :class="[
            'border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
            index === filteredGuides.length - 1 ? 'border-b-0' : ''
          ]"
          @click="openModal(guide)"
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
                    {{ guide.title }}
                  </h3>
                  <div class="flex items-center space-x-2 ml-4">
                    <span class="text-sm text-gray-500">{{ guide.createdAt }}</span>
                    <span class="text-sm text-gray-400 hidden sm:block">{{ guide.author }}</span>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ guide.body }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {{ guide.category }}
                    </span>
                  </div>
                  
                  <button 
                    class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
                    @click.stop="openModal(guide)"
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
      <div v-if="allFilteredGuides.length > 0" class="max-w-6xl mx-auto flex justify-center mt-8">
        <nav class="flex items-center space-x-1">
          <button :disabled="currentGroup <= 1" @click="goToPrevGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentPage === page ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">{{ page }}</button>
          <button :disabled="currentGroup >= totalGroups" @click="goToNextGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup >= totalGroups ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
        </nav>
      </div>

      <!-- 데이터가 없을 때 -->
      <div v-if="!loading && allFilteredGuides.length === 0" class="max-w-6xl mx-auto text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.515-.751-6.281-2.02M12 15c2.34 0 4.515-.751 6.281-2.02M12 3v12"></path>
          </svg>
        </div>
        <p class="text-gray-500 mb-4">
          {{ searchTerm ? '검색 조건에 맞는 성경개요가 없습니다.' : '등록된 성경개요가 없습니다.' }}
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

    <!-- 성경개요 상세 모달 -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full lg:w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- 모달 헤더 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <div class="flex-1 pr-4">
            <!-- 제목 (편집 가능) -->
            <input 
              v-if="role === 'admin'"
              v-model="editTitle"
              class="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50"
              placeholder="성경개요 제목을 입력하세요"
            >
            <h2 
              v-else
              class="w-full text-2xl font-bold text-gray-800"
            >
              {{ selectedGuide.title }}
            </h2>
          </div>
          <div class="flex items-center space-x-4 flex-shrink-0">
            <span class="text-sm text-gray-500">{{ selectedGuide.createdAt }}</span>
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
            <label class="block text-base font-bold text-gray-700 mb-2 sr-only">성경개요 내용</label>
            <textarea 
              v-if="role === 'admin'"
              v-model="editBody"
              :rows="calculateRows(editBody)"
              class="w-full text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50"
              placeholder="성경개요 내용을 입력하세요"
            ></textarea>
            <div 
              v-else
              class="w-full px-4 py-3 text-gray-700 leading-relaxed whitespace-pre-wrap"
            >
              {{ selectedGuide.body }}
            </div>
          </div>   
        </div>

         <!-- 모달 하단 -->
         <div class="p-6 border-t border-gray-200">
           <!-- 메타 정보 -->
           <div class="mb-10">
             <div class="flex flex-wrap gap-3 justify-center">
               <div class="bg-indigo-100 text-indigo-800 px-13 py-2 rounded-full text-sm font-medium inline-block">
                 <input 
                   v-if="role === 'admin'"
                   v-model="editCategory"
                   class="bg-transparent border-none outline-none focus:bg-indigo-200 focus:px-2 focus:py-1 focus:rounded-lg transition-all duration-200 hover:bg-indigo-200 text-center min-w-0"
                   placeholder="성경 책"
                 >
                 <span v-else>{{ selectedGuide.category }}</span>
               </div>
               <div class="bg-gray-100 text-gray-800 px-13 py-2 rounded-full text-sm font-medium inline-block">
                 <input 
                   v-if="role === 'admin'"
                   v-model="editAuthor"
                   class="bg-transparent border-none outline-none focus:bg-gray-200 focus:px-2 focus:py-1 focus:rounded-lg transition-all duration-200 hover:bg-gray-200 text-center min-w-0"
                   placeholder="작성자"
                 >
                 <span v-else>{{ selectedGuide.author }}</span>
               </div>
             </div>
           </div>

           <!-- 버튼 그룹 -->
           <div class="flex justify-center space-x-4">
             <button
               v-if="role === 'admin'" 
               @click="updateGuide"
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
               @click="deleteGuide"
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
const selectedGuideId = ref(null)
const viewMode = ref('list') // 'list' 또는 'add'
const selectedTestament = ref('') // 구약/신약 선택 상태

// 모달 관련 변수들
const modalOpen = ref(false)
const selectedGuide = ref({})
const editTitle = ref('')
const editBody = ref('')
const editCategory = ref('')
const editAuthor = ref('')
const updating = ref(false)
const deleting = ref(false)

// 새 안내 추가 관련 변수들
const newGuide = ref({
  title: '',
  body: '',
  category: ''
})
const adding = ref(false)

// 페이지네이션 관련
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Firebase에서 안내 데이터 가져오기
const guides = ref([])
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
  console.log('[PAGE] guide mounted')
  await loadGuidesFromFirebase()
})

const loadGuidesFromFirebase = async () => {
  try {
    loading.value = true
    
    // Firebase에서 데이터 가져오기
    const { $db } = useNuxtApp()
    const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
    
    const guidesCollection = collection($db, 'overview')
    const q = query(guidesCollection, orderBy('createAt', 'asc')) // 오래된 순 정렬
    
    const querySnapshot = await getDocs(q)
    const rawGuides = querySnapshot.docs.map(doc => {
      const data = doc.data()
      
      return {
        id: doc.id,
        title: data.title || '',
        category: data.category || '',
        body: data.body || '',
        author: data.author || '',
        createdAt: formatFirebaseDate(data.createdAt || data.createAt)
      }
    })
    
    // 성경책 순서로 정렬하여 저장
    guides.value = sortGuidesByBibleOrder(rawGuides)
    
    console.log('Firebase에서 성경개요 데이터 로드 완료:', guides.value.length, '개')
  } catch (error) {
    console.error('성경개요 데이터 로드 실패:', error)
    
    // 에러 발생시 빈 배열로 초기화
    guides.value = []
    
    // 사용자에게 에러 메시지 표시 (선택사항)
    // alert('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
  } finally {
    loading.value = false
  }
}

// 구약/신약 성경책 분류
const oldTestamentBooks = [
  '창세기', '출애굽기', '레위기', '민수기', '신명기', '여호수아', '사사기', '룻기', 
  '사무엘상', '사무엘하', '열왕기상', '열왕기하', '역대상', '역대하', '에스라', '느헤미야', 
  '에스더', '욥기', '시편', '잠언', '전도서', '아가', '이사야', '예레미야', '예레미야애가', 
  '에스겔', '다니엘', '호세아', '요엘', '아모스', '오바댜', '요나', '미가', '나훔', '하박국', 
  '스바냐', '학개', '스가랴', '말라기'
]

const newTestamentBooks = [
  '마태복음', '마가복음', '누가복음', '요한복음', '사도행전', '로마서', '고린도전서', '고린도후서',
  '갈라디아서', '에베소서', '빌립보서', '골로새서', '데살로니가전서', '데살로니가후서', '디모데전서',
  '디모데후서', '디도서', '빌레몬서', '히브리서', '야고보서', '베드로전서', '베드로후서', '요한일서',
  '요한이서', '요한삼서', '유다서', '요한계시록'
]

// 성경 66권 전체 순서 (정렬용)
const allBibleBooks = [
  // 구약 39권
  '창세기', '출애굽기', '레위기', '민수기', '신명기', '여호수아', '사사기', '룻기', 
  '사무엘상', '사무엘하', '열왕기상', '열왕기하', '역대상', '역대하', '에스라', '느헤미야', 
  '에스더', '욥기', '시편', '잠언', '전도서', '아가', '이사야', '예레미야', '예레미야애가', 
  '에스겔', '다니엘', '호세아', '요엘', '아모스', '오바댜', '요나', '미가', '나훔', '하박국', 
  '스바냐', '학개', '스가랴', '말라기',
  // 신약 27권
  '마태복음', '마가복음', '누가복음', '요한복음', '사도행전', '로마서', '고린도전서', '고린도후서',
  '갈라디아서', '에베소서', '빌립보서', '골로새서', '데살로니가전서', '데살로니가후서', '디모데전서',
  '디모데후서', '디도서', '빌레몬서', '히브리서', '야고보서', '베드로전서', '베드로후서', '요한일서',
  '요한이서', '요한삼서', '유다서', '요한계시록'
]

// 제목에서 성경책명 추출하는 함수
const extractBookFromTitle = (title) => {
  if (!title) return null
  
  // 성경책명을 찾아서 반환
  for (const book of allBibleBooks) {
    if (title.includes(book)) {
      return book
    }
  }
  return null
}

// 성경책 순서로 정렬하는 함수
const sortGuidesByBibleOrder = (guides) => {
  return guides.sort((a, b) => {
    const bookA = extractBookFromTitle(a.title) || a.category
    const bookB = extractBookFromTitle(b.title) || b.category
    
    const indexA = allBibleBooks.indexOf(bookA)
    const indexB = allBibleBooks.indexOf(bookB)
    
    // 성경책 순서가 있으면 그것으로 정렬, 없으면 기존 순서 유지
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    } else if (indexA !== -1) {
      return -1 // A가 성경책이면 앞으로
    } else if (indexB !== -1) {
      return 1 // B가 성경책이면 A를 뒤로
    } else {
      return 0 // 둘 다 성경책이 아니면 순서 유지
    }
  })
}

// 필터링된 성경개요 목록 (페이지네이션 전)
const allFilteredGuides = computed(() => {
  let filtered = guides.value

  // 구약/신약 필터
  if (selectedTestament.value) {
    const testamentBooks = selectedTestament.value === '구약' ? oldTestamentBooks : newTestamentBooks
    filtered = filtered.filter(guide => 
      testamentBooks.includes(guide.category)
    )
  }

  // 검색어 필터
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase().trim()
    filtered = filtered.filter(guide => 
      (guide.title && guide.title.toLowerCase().includes(search)) ||
      (guide.body && guide.body.toLowerCase().includes(search)) ||
      (guide.author && guide.author.toLowerCase().includes(search)) ||
      (guide.category && guide.category.toLowerCase().includes(search))
    )
  }

  // 성경책 순서로 정렬
  return sortGuidesByBibleOrder(filtered)
})

// 페이지네이션 계산 (10페이지 단위 그룹)
const pagesPerGroup = ref(10)
const totalPages = computed(() => Math.ceil(allFilteredGuides.value.length / itemsPerPage.value))
const totalGroups = computed(() => Math.ceil(totalPages.value / pagesPerGroup.value))
const currentGroup = ref(1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

// 현재 페이지의 성경개요 목록
const filteredGuides = computed(() => {
  return allFilteredGuides.value.slice(startIndex.value, endIndex.value)
})

// 페이지네이션 표시용 페이지 번호들 (현재 그룹 기준)
const visiblePages = computed(() => {
  const pages = []
  const start = (currentGroup.value - 1) * pagesPerGroup.value + 1
  const end = Math.min(currentGroup.value * pagesPerGroup.value, totalPages.value)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// 성경개요 선택/해제 (기존 기능 유지)
const selectGuide = (guide) => {
  if (selectedGuideId.value === guide.id) {
    selectedGuideId.value = null
  } else {
    selectedGuideId.value = guide.id
  }
}

// 모달 열기
const openModal = (guide) => {
  selectedGuide.value = guide
  editTitle.value = guide.title
  editBody.value = guide.body
  editCategory.value = guide.category
  editAuthor.value = guide.author
  modalOpen.value = true
}

// 모달 닫기
const closeModal = () => {
  modalOpen.value = false
  selectedGuide.value = {}
  editTitle.value = ''
  editBody.value = ''
  editCategory.value = ''
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
    selectedGuideId.value = null // 페이지 변경시 선택 해제
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
  searchTerm.value = ''
  selectedTestament.value = ''
  await loadGuidesFromFirebase()
  currentPage.value = 1
  selectedGuideId.value = null
}

// 구약/신약 검색 함수
const searchByTestament = (testament) => {
  if (selectedTestament.value === testament) {
    // 같은 버튼을 다시 클릭하면 선택 해제
    selectedTestament.value = ''
  } else {
    selectedTestament.value = testament
  }
  currentPage.value = 1
  selectedGuideId.value = null
}

// 구약/신약 검색 초기화
const clearTestamentSearch = () => {
  selectedTestament.value = ''
  currentPage.value = 1
  selectedGuideId.value = null
}

// 필터 초기화
const clearFilters = () => {
  searchTerm.value = ''
  selectedTestament.value = ''
  currentPage.value = 1
  selectedGuideId.value = null
}

// 안내 수정 함수
const updateGuide = async () => {
  if (!selectedGuide.value.id) return
  
  try {
    updating.value = true
    
    const { $db } = useNuxtApp()
    const { doc, updateDoc } = await import('firebase/firestore')
    
    const guideDoc = doc($db, 'overview', selectedGuide.value.id)
    await updateDoc(guideDoc, {
      title: editTitle.value,
      body: editBody.value,
      category: editCategory.value,
      author: editAuthor.value
    })
    
    // 로컬 데이터 업데이트
    const guideIndex = guides.value.findIndex(guide => guide.id === selectedGuide.value.id)
    if (guideIndex !== -1) {
      guides.value[guideIndex] = {
        ...guides.value[guideIndex],
        title: editTitle.value,
        body: editBody.value,
        category: editCategory.value,
        author: editAuthor.value
      }
    }
    
    // 선택된 안내도 업데이트
    selectedGuide.value = {
      ...selectedGuide.value,
      title: editTitle.value,
      body: editBody.value,
      category: editCategory.value,
      author: editAuthor.value
    }
    
    console.log('성경개요 수정 완료')
    alert('성경개요가 성공적으로 수정되었습니다.')
    
  } catch (error) {
    console.error('성경개요 수정 실패:', error)
    alert('성경개요 수정 중 오류가 발생했습니다.')
  } finally {
    updating.value = false
  }
}

// 성경개요 삭제 함수
const deleteGuide = async () => {
  if (!selectedGuide.value.id) return
  
  if (!confirm('정말로 이 성경개요를 삭제하시겠습니까?')) {
    return
  }
  
  try {
    deleting.value = true
    
    const { $db } = useNuxtApp()
    const { doc, deleteDoc } = await import('firebase/firestore')
    
    const guideDoc = doc($db, 'overview', selectedGuide.value.id)
    await deleteDoc(guideDoc)
    
    // 로컬 데이터에서 제거
    guides.value = guides.value.filter(guide => guide.id !== selectedGuide.value.id)
    
    console.log('성경개요 삭제 완료')
    alert('성경개요가 성공적으로 삭제되었습니다.')
    
    // 모달 닫기
    closeModal()
    
  } catch (error) {
    console.error('성경개요 삭제 실패:', error)
    alert('성경개요 삭제 중 오류가 발생했습니다.')
  } finally {
    deleting.value = false
  }
}

// 새 성경개요 추가 함수
const addNewGuide = async () => {
  try {
    adding.value = true
    
    const { $db } = useNuxtApp()
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    
    const guidesCollection = collection($db, 'overview')
    
    const docRef = await addDoc(guidesCollection, {
      title: newGuide.value.title,
      body: newGuide.value.body,
      category: newGuide.value.category,
      author: '관리자',
      createAt: serverTimestamp()
    })
    
    // 로컬 데이터에 새 안내 추가
    const newGuideData = {
      id: docRef.id,
      title: newGuide.value.title,
      body: newGuide.value.body,
      category: newGuide.value.category,
      author: '관리자',
      createdAt: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    guides.value.push(newGuideData) // 오래된 순으로 맨 뒤에 추가
    
    // 폼 초기화
    newGuide.value = {
      title: '',
      body: '',
      category: ''
    }
    
    // 목록 보기로 전환
    viewMode.value = 'list'
    
    console.log('새 성경개요 추가 완료')
    alert('성경개요가 성공적으로 추가되었습니다.')
    
  } catch (error) {
    console.error('성경개요 추가 실패:', error)
    alert('성경개요 추가 중 오류가 발생했습니다.')
  } finally {
    adding.value = false
  }
}

// 검색 변경시 첫 페이지로 이동
watch([searchTerm, selectedTestament], () => {
  currentPage.value = 1
  selectedGuideId.value = null
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
