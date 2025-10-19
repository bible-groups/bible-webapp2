<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <h1 class="text-[1.8rem] xl:text-3xl font-bold text-gray-800 mb-4">기도장</h1>
        <p class="text-gray-600">기도 제목을 기록하고 함께 나누세요</p>
      </div>

      <!-- 스위칭 버튼 -->
      <div class="flex justify-center mb-6" v-if="role === 'admin'">
        <div class="bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          <button @click="viewMode = 'list'" :class="['px-6 py-2 rounded-md text-sm font-medium transition-colors', viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:text-gray-800']">기도 목록</button>
          <button @click="viewMode = 'add'"  :class="['px-6 py-2 rounded-md text-sm font-medium transition-colors', viewMode === 'add'  ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:text-gray-800']">기도 추가</button>
        </div>
      </div>

      <!-- 검색 영역 -->
      <div class="max-w-6xl mx-auto mb-8">
        <div class="relative">
          <input v-model="searchTerm" type="text" placeholder="기도 내용을 검색하세요..." class="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
            <button @click="refreshData" :disabled="loading" class="p-1 text-gray-400 hover:text-indigo-600 transition-colors" title="새로고침">
              <svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
            <div class="w-5 h-5 text-gray-400"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
          </div>
        </div>
      </div>

      <!-- 기도 추가 폼 -->
      <div v-if="viewMode === 'add'" class="max-w-6xl mx-auto mb-8 border border-gray-200 rounded-lg">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">새 기도 추가</h2>
          <form @submit.prevent="addNewPrayer" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input v-model="newPrayer.title" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="기도 제목을 입력하세요">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
              <textarea v-model="newPrayer.body" required rows="6" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" placeholder="기도 내용을 입력하세요"></textarea>
            </div>
            <div class="flex justify-center space-x-3 pt-4">              
              <button type="submit" :disabled="adding" class="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2">
                <svg v-if="adding" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                <span>{{ adding ? '추가 중...' : '기도 추가' }}</span>
              </button>
              <button type="button" @click="viewMode = 'list'" class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors">취소</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="text-center py-12">
        <div class="flex flex-col items-center justify-center">
          <div class="w-32 h-px bg-gray-300 mb-8"></div>
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
        </div>
      </div>

      <!-- 기도 목록 -->
      <div v-else-if="viewMode === 'list'" class="max-w-6xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div v-for="(prayer, index) in filteredPrayers" :key="prayer.id" :class="['border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer', index === filteredPrayers.length - 1 ? 'border-b-0' : '']" @click="openModal(prayer)">
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <!-- 아이콘: 손 모양(기도) -->
              <div class="flex-shrink-0 mt-1">
                <div class="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center">
                  <i class="fa fa-hand-paper-o text-white text-lg fa-fw"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-md xl:text-lg font-semibold text-gray-900 truncate">{{ prayer.title }}</h3>
                  <div class="flex items-center space-x-2 ml-4">
                    <span class="text-sm text-gray-500">{{ prayer.createdAt }}</span>
                    <span class="text-sm text-gray-400 hidden sm:block">{{ prayer.author }}</span>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ prayer.body }}</p>
                <div class="flex items-center justify-between">
                  <div></div>
                  <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1" @click.stop="openModal(prayer)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg><span>자세히</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="allFilteredPrayers.length > 0" class="max-w-6xl mx-auto flex justify-center mt-8">
        <nav class="flex items-center space-x-1">
          <button :disabled="currentGroup <= 1" @click="goToPrevGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentPage === page ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">{{ page }}</button>
          <button :disabled="currentGroup >= totalGroups" @click="goToNextGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup >= totalGroups ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
        </nav>
      </div>

      <!-- 데이터가 없을 때 -->
      <div v-if="!loading && allFilteredPrayers.length === 0" class="max-w-6xl mx-auto text-center py-12">
        <div class="text-gray-400 mb-4"><svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></div>
        <p class="text-gray-500">등록된 기도가 없습니다.</p>
      </div>
    </div>

    <!-- 상세 모달 -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full lg:w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <div class="flex-1 pr-4">
            <input v-model="editTitle" class="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50" placeholder="기도 제목을 입력하세요">
          </div>
          <div class="flex items-center space-x-4 flex-shrink-0">
            <span class="text-sm text-gray-500">{{ selectedPrayer.createdAt }}</span>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
          </div>
        </div>
        <!-- 모달 내용 영역 (60% 고정) -->
        <div class="p-6 overflow-y-auto" style="height: 60vh;">
          <div class="mb-6">
            <label class="block text-base font-bold text-gray-700 mb-2">기도 내용</label>
            <textarea v-model="editBody" :rows="calculateRows(editBody)" class="w-full text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50" placeholder="기도 내용을 입력하세요"></textarea>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200">
          <div class="flex justify-center space-x-4">
            <button @click="updatePrayer" :disabled="updating" class="w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center sm:space-x-2 cursor-pointer">
              <svg v-if="updating" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              <span class="hidden sm:inline sm:ml-2">{{ updating ? '수정 중...' : '수정' }}</span>
            </button>
            <button @click="deletePrayer" :disabled="deleting" class="w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center sm:space-x-2 cursor-pointer">
              <svg v-if="deleting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              <span class="hidden sm:inline sm:ml-2">{{ deleting ? '삭제 중...' : '삭제' }}</span>
            </button>
            <button @click="closeModal" class="w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center sm:space-x-2 cursor-pointer"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg><span class="hidden sm:inline sm:ml-2">창닫기</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] })

// 인증 정보
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)
const role = computed(() => authStore.currentUserRole)

// 접근 권한 체크 (관리자만 접근 가능)
const canAccess = computed(() => {
  return authStore.isAuthenticated && role.value === 'admin'
})

// 컴포넌트 마운트 시 권한 체크
onMounted(() => {
  if (!canAccess.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      fatal: true,
      message: '관리자 권한이 필요한 페이지입니다.'
    })
  }
})

// 상태
const searchTerm = ref('')
const viewMode = ref('list')

// 모달 상태
const modalOpen = ref(false)
const selectedPrayer = ref({})
const editTitle = ref('')
const editBody = ref('')
const updating = ref(false)
const deleting = ref(false)

// 추가 폼
const newPrayer = ref({ title: '', body: '' })
const adding = ref(false)

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = ref(10)
const pagesPerGroup = ref(10)
const currentGroup = ref(1)

// 데이터
const prayers = ref([])
const loading = ref(true)

// 날짜 포맷터
const formatFirebaseDate = (timestamp) => {
  try {
    if (!timestamp) return ''
    let date
    if (timestamp.toDate && typeof timestamp.toDate === 'function') date = timestamp.toDate()
    else if (timestamp.seconds) date = new Date(timestamp.seconds * 1000)
    else if (typeof timestamp === 'string') return timestamp
    else date = new Date(timestamp)
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (e) {
    console.error('날짜 변환 오류:', e)
    return '날짜 오류'
  }
}

onMounted(async () => {
  console.log('[PAGE] prayer mounted')
  await loadPrayersFromFirebase()
})

const loadPrayersFromFirebase = async () => {
  try {
    loading.value = true
    const { $db } = useNuxtApp()
    const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
    const prayerCollection = collection($db, 'prayer')
    const q = query(prayerCollection, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    prayers.value = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title || '',
        body: data.body || '',
        author: data.author || '',
        createdAt: formatFirebaseDate(data.createdAt)
      }
    })
  } catch (e) {
    console.error('기도 데이터 로드 실패:', e)
    prayers.value = []
  } finally {
    loading.value = false
  }
}

// 검색 및 페이지네이션
const allFilteredPrayers = computed(() => {
  let filtered = prayers.value
  if (searchTerm.value) {
    const s = searchTerm.value.toLowerCase().trim()
    filtered = filtered.filter(p => (p.title && p.title.toLowerCase().includes(s)) || (p.body && p.body.toLowerCase().includes(s)) || (p.author && p.author.toLowerCase().includes(s)))
  }
  return filtered
})
const totalPages = computed(() => Math.ceil(allFilteredPrayers.value.length / itemsPerPage.value))
const totalGroups = computed(() => Math.ceil(totalPages.value / pagesPerGroup.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)
const filteredPrayers = computed(() => allFilteredPrayers.value.slice(startIndex.value, endIndex.value))
const visiblePages = computed(() => { const pages = []; const start = (currentGroup.value-1)*pagesPerGroup.value + 1; const end = Math.min(currentGroup.value*pagesPerGroup.value, totalPages.value); for (let i=start; i<=end; i++) pages.push(i); return pages })
const goToPage = (page) => { if (page >= 1 && page <= totalPages.value) { currentPage.value = page; currentGroup.value = Math.ceil(page / pagesPerGroup.value) } }
const goToNextGroup = () => { if(currentGroup.value < totalGroups.value){ currentGroup.value++; currentPage.value = (currentGroup.value-1)*pagesPerGroup.value + 1 } }
const goToPrevGroup = () => { if(currentGroup.value > 1){ currentGroup.value--; currentPage.value = (currentGroup.value-1)*pagesPerGroup.value + 1 } }

// 새로고침
const refreshData = async () => { await loadPrayersFromFirebase(); currentPage.value = 1 }

// 모달
const openModal = (prayer) => { selectedPrayer.value = prayer; editTitle.value = prayer.title; editBody.value = prayer.body; modalOpen.value = true }
const closeModal = () => { modalOpen.value = false; selectedPrayer.value = {}; editTitle.value=''; editBody.value=''; updating.value=false; deleting.value=false }

// 행수 계산
const calculateRows = (text) => { if (!text) return 3; const lines = text.split('\n'); let total = lines.length; for (let l of lines) total += Math.floor(l.length/80); return Math.max(3,total) }

// 추가
const addNewPrayer = async () => {
  try {
    adding.value = true
    const { $db } = useNuxtApp()
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    const prayerCollection = collection($db, 'prayer')
    const docRef = await addDoc(prayerCollection, { title: newPrayer.value.title, body: newPrayer.value.body, author: '관리자', createdAt: serverTimestamp() })
    const local = { id: docRef.id, title: newPrayer.value.title, body: newPrayer.value.body, author: '관리자', createdAt: new Date().toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' }) }
    prayers.value.unshift(local); newPrayer.value = { title:'', body:'' }; viewMode.value='list'; alert('기도가 성공적으로 추가되었습니다.')
  } catch (e) { console.error('기도 추가 실패:', e); alert('기도 추가 중 오류가 발생했습니다.') } finally { adding.value=false }
}

// 수정
const updatePrayer = async () => { if (!selectedPrayer.value.id) return; try { updating.value=true; const { $db } = useNuxtApp(); const { doc, updateDoc } = await import('firebase/firestore'); const pDoc = doc($db, 'prayer', selectedPrayer.value.id); await updateDoc(pDoc, { title: editTitle.value, body: editBody.value }); const idx = prayers.value.findIndex(p=>p.id===selectedPrayer.value.id); if (idx!==-1) prayers.value[idx] = { ...prayers.value[idx], title: editTitle.value, body: editBody.value }; selectedPrayer.value = { ...selectedPrayer.value, title: editTitle.value, body: editBody.value }; alert('기도가 성공적으로 수정되었습니다.') } catch(e){ console.error('기도 수정 실패:', e); alert('기도 수정 중 오류가 발생했습니다.') } finally { updating.value=false } }

// 삭제
const deletePrayer = async () => { if (!selectedPrayer.value.id) return; if (!confirm('정말로 이 기도를 삭제하시겠습니까?')) return; try { deleting.value=true; const { $db } = useNuxtApp(); const { doc, deleteDoc } = await import('firebase/firestore'); const pDoc = doc($db, 'prayer', selectedPrayer.value.id); await deleteDoc(pDoc); prayers.value = prayers.value.filter(p=>p.id!==selectedPrayer.value.id); alert('기도가 성공적으로 삭제되었습니다.'); closeModal() } catch(e){ console.error('기도 삭제 실패:', e); alert('기도 삭제 중 오류가 발생했습니다.') } finally { deleting.value=false } }

// 검색 변경 시 첫 페이지로
watch([searchTerm], () => { currentPage.value = 1 })
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
