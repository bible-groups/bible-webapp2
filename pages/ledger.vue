<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <h1 class="text-[1.8rem] xl:text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center">
          현금 출납장
        </h1>
        <p class="text-gray-600">거래 내역을 기록하고 관리하세요</p>
      </div>

      <!-- 스위칭 버튼 -->
      <div class="flex justify-center mb-6" v-if="role === 'admin'">
        <div class="bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          <button @click="viewMode = 'list'" :class="['px-6 py-2 rounded-md text-sm font-medium transition-colors', viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:text-gray-800']">거래 목록</button>
          <button @click="viewMode = 'add'"  :class="['px-6 py-2 rounded-md text-sm font-medium transition-colors', viewMode === 'add'  ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:text-gray-800']">새 거래 추가</button>
          </div>
        </div>

      <!-- 검색 및 필터 -->
      <div class="max-w-4xl mx-auto mb-12">
        <div class="flex gap-4 items-center">
          <!-- 검색창 -->
          <div class="flex-1 relative">
            <input v-model="searchTerm" type="text" placeholder="거래 내역 검색... (구분/거래처/결제수단/비고)" class="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
              <button @click="refreshData" :disabled="loading" class="p-1 text-gray-400 hover:text-indigo-600 transition-colors" title="새로고침">
                <svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </button>
              <div class="w-5 h-5 text-gray-400"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
            </div>
          </div>
          
          <!-- 기간 필터 -->
          <div class="relative period-filter-container">
            <button @click="togglePeriodFilter" :class="['flex items-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors', periodFilterOpen ? 'ring-2 ring-indigo-500 border-indigo-500' : '']">
              <span class="text-sm font-medium text-gray-700 mr-2">{{ selectedPeriod }}</span>
              <svg :class="['w-4 h-4 text-gray-400 transition-transform', periodFilterOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- 드롭다운 메뉴 -->
            <div v-if="periodFilterOpen" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div class="py-1">
                <button v-for="period in periodOptions" :key="period.value" @click="selectPeriod(period)" :class="['w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors', selectedPeriod === period.label ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700']">
                  {{ period.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 추가 폼 -->
      <div v-if="viewMode === 'add'" class="max-w-6xl mx-auto w-full mb-8 border border-gray-200 rounded-lg">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-6">새 거래 추가</h3>
          <form @submit.prevent="addNewLedger" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">구분</label>
              <div class="grid grid-cols-2 gap-4">
                <button type="button" @click="newLedger.cash_flow = '입금'" :class="['p-4 border rounded-lg text-center transition-colors', newLedger.cash_flow === '입금' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400']"><i class="fa fa-plus text-blue-500 mr-2"></i>입금</button>
                <button type="button" @click="newLedger.cash_flow = '지출'" :class="['p-4 border rounded-lg text-center transition-colors', newLedger.cash_flow === '지출' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 hover:border-gray-400']"><i class="fa fa-minus text-red-500 mr-2"></i>지출</button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">날짜</label>
              <input v-model="newLedger.date" type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">금액</label>
              <div class="relative">
                <input v-model.number="newLedger.amount" type="number" min="0" step="1000" required placeholder="0" class="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <span class="absolute right-3 top-2 text-gray-500">원</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">거래처</label>
              <input v-model="newLedger.merchant" type="text" placeholder="거래처" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">결제수단</label>
              <select v-model="newLedger.payment_method" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">선택</option>
                <option value="현금">현금</option>
                <option value="카드">카드</option>
                <option value="계좌이체">계좌이체</option>
                <option value="자동이체">자동이체</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">비고</label>
              <input v-model="newLedger.description" type="text" placeholder="내역/비고" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div class="flex justify-end space-x-4">              
              <button type="submit" :disabled="adding" class="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{{ adding ? '추가 중...' : '추가하기' }}</button>
              <button type="button" @click="resetForm" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 로딩 -->
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-400 mb-4"><svg class="w-10 h-10 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></div>
        </div>

      <!-- 목록 테이블 -->
      <div v-else-if="viewMode === 'list'" class="max-w-7xl mx-auto">
        <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="w-24 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                  <th class="w-20 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider text-center">구분</th>
                  <th class="w-32 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider text-center">금액</th>
                  <th class="w-40 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">거래처</th>
                  <th class="w-28 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">결제수단</th>
                  <th class="w-48 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">내역</th>
                  <th class="w-20 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="row in pagedRows" :key="row.id" class="hover:bg-gray-50">
                  <td class="w-24 px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(row.date) }}</td>
                  <td class="w-20 px-6 py-4 whitespace-nowrap text-center"><span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', (row.cash_flow === '수입' || row.cash_flow === '입금') ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800']">{{ row.cash_flow }}</span></td>
                  <td class="w-32 px-6 py-4 whitespace-nowrap text-sm"><span :class="['font-semibold block text-center', (row.cash_flow === '수입' || row.cash_flow === '입금') ? 'text-blue-600' : 'text-red-600']">{{ formatCurrency(row.amount) }}</span></td>
                  <td class="w-40 px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{{ row.merchant }}</td>
                  <td class="w-28 px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{{ row.payment_method }}</td>
                  <td class="w-48 px-6 py-4 text-sm text-center text-gray-900">{{ row.description }}</td>
                  <td class="w-20 px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex justify-center space-x-2">
                      <button @click="openModal(row)" class="text-blue-500 hover:text-blue-900 text-lg"><i class="fa fa-pencil-square-o fa-fw"></i></button>
                      <button @click="deleteRow(row.id)" class="text-red-400 hover:text-red-900 text-lg"><i class="fa fa-trash fa-fw"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="allFilteredRows.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4"><svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.515-.751-6.281-2.02M12 15c2.34 0 4.515-.751 6.281-2.02M12 3v12"></path></svg></div>
            <p class="text-gray-500">거래 내역이 없습니다.</p>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="allFilteredRows.length > 0 && totalPages > 1" class="flex justify-center mt-8">
          <nav class="flex items-center space-x-1">
            <!-- 이전 10개 페이지 그룹 이동 -->
            <button :disabled="currentGroup <= 1" @click="goToPrevGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']" title="이전 10페이지">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            <!-- 페이지 번호들 -->
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentPage === page ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">{{ page }}</button>
            
            <!-- 다음 10개 페이지 그룹 이동 -->
            <button :disabled="currentGroup >= totalGroups" @click="goToNextGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup >= totalGroups ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']" title="다음 10페이지">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </nav>
        </div>
          </div>

      <!-- 편집 모달 -->
      <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4" @click.self="closeModal">
        <div class="bg-white rounded-lg shadow-xl w-[100vh] max-h-[90vh] overflow-hidden">
          <!-- 모달 헤더 -->
          <div class="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 class="text-xl font-semibold text-gray-800">거래 수정</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- 모달 본문 -->
          <div class="p-6 overflow-y-auto max-h-[60vh]">
            <div class="space-y-6">
              <!-- 구분 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">구분</label>
                <div class="grid grid-cols-2 gap-4">
                  <button type="button" @click="editForm.cash_flow = '입금'" :class="['p-4 border rounded-lg text-center transition-colors', (editForm.cash_flow === '입금' || editForm.cash_flow === '수입') ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400']">
                    <i class="fa fa-plus text-blue-500 mr-2"></i>입금
                  </button>
                  <button type="button" @click="editForm.cash_flow = '지출'" :class="['p-4 border rounded-lg text-center transition-colors', editForm.cash_flow === '지출' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 hover:border-gray-400']">
                    <i class="fa fa-minus text-red-500 mr-2"></i>지출
                  </button>
                </div>
              </div>
              
              <!-- 날짜와 금액 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                  <input v-model="editForm.date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">금액</label>
                  <div class="relative">
                    <input v-model.number="editForm.amount" type="number" min="0" step="1000" class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0">
                    <span class="absolute right-3 top-2 text-gray-500">원</span>
                  </div>
                </div>
              </div>
              
              <!-- 거래처와 결제수단 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">거래처</label>
                  <input v-model="editForm.merchant" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="거래처">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">결제수단</label>
                  <div class="relative">
                    <select v-model="editForm.payment_method" class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                      <option value="">선택</option>
                      <option value="현금">현금</option>
                      <option value="카드">카드</option>
                      <option value="계좌이체">계좌이체</option>
                      <option value="자동이체">자동이체</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 비고 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">비고</label>
                <textarea v-model="editForm.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="내역/비고"></textarea>
              </div>
            </div>
          </div>
          
          <!-- 모달 하단 -->
          <div class="p-6 border-t border-gray-200">
            <div class="flex justify-center space-x-4">
              <button @click="updateRow" :disabled="updating" class="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{{ updating ? '수정 중...' : '수정' }}</button>
              <button @click="closeModal" class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors">창닫기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] })

// 인증
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
const viewMode = ref('list')
const searchTerm = ref('')
const loading = ref(true)
const adding = ref(false)
const rows = ref([])

// 기간 필터
const periodFilterOpen = ref(false)
const selectedPeriod = ref('전체 기간')
const periodOptions = ref([
  { label: '전체 기간', value: 'all' },
  { label: '2024년 1월', value: '2024-01' },
  { label: '2024년 2월', value: '2024-02' },
  { label: '2024년 3월', value: '2024-03' },
  { label: '2024년 4월', value: '2024-04' },
  { label: '2024년 5월', value: '2024-05' },
  { label: '2024년 6월', value: '2024-06' },
  { label: '2024년 7월', value: '2024-07' },
  { label: '2024년 8월', value: '2024-08' },
  { label: '2024년 9월', value: '2024-09' },
  { label: '2024년 10월', value: '2024-10' },
  { label: '2024년 11월', value: '2024-11' },
  { label: '2024년 12월', value: '2024-12' }
])

// 추가 폼
const newLedger = ref({ cash_flow: '지출', date: new Date().toISOString().split('T')[0], amount: 0, merchant: '', payment_method: '', description: '' })

// 모달
const modalOpen = ref(false)
const selectedId = ref('')
const editForm = ref({ cash_flow: '지출', date: '', amount: 0, merchant: '', payment_method: '', description: '' })
const updating = ref(false)

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = ref(10)
const pagesPerGroup = ref(10) // 한 그룹에 보여줄 페이지 수
const currentGroup = ref(1) // 현재 페이지 그룹

// helpers
const toTimestampFromDateInput = (yyyyMmDd) => { try { const d = new Date(yyyyMmDd + 'T00:00:00'); return d } catch(e){ return new Date() } }
const formatDate = (ts) => { try { let d; if (!ts) return ''; if (ts.toDate) d = ts.toDate(); else if (ts.seconds) d = new Date(ts.seconds*1000); else d = new Date(ts); return d.toLocaleDateString('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit' }) } catch(e){ return '' } }
const formatCurrency = (n) => new Intl.NumberFormat('ko-KR').format(Number(n||0)) + '원'

// 날짜 입력용(YYYY-MM-DD) 로컬 기준 포맷터 - toISOString() 사용 금지(UTC로 밀림 방지)
const toYmdLocal = (dateLike) => {
  try {
    let d
    if (!dateLike) return ''
    if (dateLike.toDate) d = dateLike.toDate()
    else if (dateLike.seconds) d = new Date(dateLike.seconds * 1000)
    else d = new Date(dateLike)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${da}`
  } catch (e) {
    return ''
  }
}

onMounted(async () => { console.log('[PAGE] ledger mounted'); await loadRowsFromFirebase() })

const loadRowsFromFirebase = async () => {
  try {
    loading.value = true
    const { $db } = useNuxtApp()
    const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
    const col = collection($db, 'ledger')
    const q = query(col, orderBy('date', 'desc'))
    const snap = await getDocs(q)
    rows.value = snap.docs.map(doc => { const d = doc.data(); return { id: doc.id, date: d.date, cash_flow: d.cash_flow || '지출', amount: d.amount || 0, merchant: d.merchant || '', payment_method: d.payment_method || '', description: d.description || '', author: d.author || '' } })
  } catch (e) {
    console.error('거래 로드 실패:', e)
    rows.value = []
  } finally { loading.value = false }
}

// 기간 필터 함수들
const togglePeriodFilter = () => {
  periodFilterOpen.value = !periodFilterOpen.value
}

const selectPeriod = (period) => {
  selectedPeriod.value = period.label
  periodFilterOpen.value = false
  currentPage.value = 1
}

const isDateInPeriod = (date, periodValue) => {
  if (periodValue === 'all') return true
  
  try {
    let d
    if (date.toDate) d = date.toDate()
    else if (date.seconds) d = new Date(date.seconds * 1000)
    else d = new Date(date)
    
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const dateString = `${year}-${month}`
    
    return dateString === periodValue
  } catch (e) {
    return false
  }
}

// 필터링/페이지네이션
const allFilteredRows = computed(() => { 
  let f = rows.value
  
  // 검색어 필터
  if (searchTerm.value) { 
    const s = searchTerm.value.toLowerCase().trim()
    f = f.filter(r => 
      (r.merchant && r.merchant.toLowerCase().includes(s)) || 
      (r.payment_method && r.payment_method.toLowerCase().includes(s)) || 
      (r.description && r.description.toLowerCase().includes(s)) || 
      (r.cash_flow && r.cash_flow.toLowerCase().includes(s))
    ) 
  }
  
  // 기간 필터
  const selectedPeriodValue = periodOptions.value.find(p => p.label === selectedPeriod.value)?.value
  if (selectedPeriodValue && selectedPeriodValue !== 'all') {
    f = f.filter(r => isDateInPeriod(r.date, selectedPeriodValue))
  }
  
  return f 
})
const totalPages = computed(() => Math.ceil(allFilteredRows.value.length / itemsPerPage.value))
const totalGroups = computed(() => Math.ceil(totalPages.value / pagesPerGroup.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)
const pagedRows = computed(() => allFilteredRows.value.slice(startIndex.value, endIndex.value))
const visiblePages = computed(() => { 
  const pages = []
  const start = (currentGroup.value - 1) * pagesPerGroup.value + 1
  const end = Math.min(currentGroup.value * pagesPerGroup.value, totalPages.value)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages 
})
const goToPage = (p) => { 
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
    currentGroup.value = Math.ceil(p / pagesPerGroup.value)
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

// 새로고침
const refreshData = async () => { 
  await loadRowsFromFirebase()
  currentPage.value = 1
  currentGroup.value = 1
}

// 추가
const resetForm = () => { newLedger.value = { cash_flow:'지출', date:new Date().toISOString().split('T')[0], amount:0, merchant:'', payment_method:'', description:'' } }
const addNewLedger = async () => {
  try {
    adding.value = true
    const { $db } = useNuxtApp()
    const { collection, addDoc, serverTimestamp, Timestamp } = await import('firebase/firestore')
    const col = collection($db, 'ledger')
    const payload = {
      date: Timestamp.fromDate(toTimestampFromDateInput(newLedger.value.date)),
      cash_flow: newLedger.value.cash_flow,
      amount: Number(newLedger.value.amount || 0),
      merchant: newLedger.value.merchant,
      payment_method: newLedger.value.payment_method,
      description: newLedger.value.description,
      author: '관리자',
      createdAt: serverTimestamp()
    }
    const docRef = await addDoc(col, payload)
    rows.value.unshift({ id: docRef.id, ...payload })
    resetForm()
    viewMode.value = 'list'
    alert('거래가 성공적으로 추가되었습니다.')
  } catch (e) { console.error('거래 추가 실패:', e); alert('거래 추가 중 오류가 발생했습니다.') } finally { adding.value = false }
}

// 모달 편집
const openModal = (row) => { 
  selectedId.value = row.id
  // 기존 데이터를 입금/지출로 매핑
  let mappedCashFlow = row.cash_flow || '지출'
  if (mappedCashFlow === '수입') mappedCashFlow = '입금'
  
  editForm.value = { 
    cash_flow: mappedCashFlow, 
    date: toYmdLocal(row.date), 
    amount: row.amount, 
    merchant: row.merchant, 
    payment_method: row.payment_method, 
    description: row.description 
  }
  modalOpen.value = true 
}
const closeModal = () => { modalOpen.value = false; selectedId.value=''; updating.value=false }
const updateRow = async () => { if(!selectedId.value) return; try { updating.value=true; const { $db } = useNuxtApp(); const { doc, updateDoc, Timestamp } = await import('firebase/firestore'); const d = doc($db,'ledger', selectedId.value); await updateDoc(d, { cash_flow: editForm.value.cash_flow, date: Timestamp.fromDate(toTimestampFromDateInput(editForm.value.date)), amount: Number(editForm.value.amount||0), merchant: editForm.value.merchant, payment_method: editForm.value.payment_method, description: editForm.value.description }); const i = rows.value.findIndex(r=>r.id===selectedId.value); if(i!==-1){ rows.value[i] = { ...rows.value[i], cash_flow: editForm.value.cash_flow, date: Timestamp.fromDate(toTimestampFromDateInput(editForm.value.date)), amount: Number(editForm.value.amount||0), merchant: editForm.value.merchant, payment_method: editForm.value.payment_method, description: editForm.value.description } } alert('거래가 수정되었습니다.') } catch(e){ console.error('거래 수정 실패:', e); alert('거래 수정 중 오류가 발생했습니다.') } finally { updating.value=false; closeModal() } }

// 삭제
const deleteRow = async (id) => { if(!id) return; if(!confirm('정말로 이 거래를 삭제하시겠습니까?')) return; try { const { $db } = useNuxtApp(); const { doc, deleteDoc } = await import('firebase/firestore'); await deleteDoc(doc($db,'ledger', id)); rows.value = rows.value.filter(r=>r.id!==id); alert('거래가 삭제되었습니다.') } catch(e){ console.error('거래 삭제 실패:', e); alert('거래 삭제 중 오류가 발생했습니다.') } }

watch([searchTerm], () => { currentPage.value = 1 })

// 드롭다운 외부 클릭 시 닫기
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.period-filter-container')) {
      periodFilterOpen.value = false
    }
  })
})
</script>

<style scoped>
/* 추가 스타일이 필요하면 여기에 작성 */

/* 1280px 밑에서 안쪽 스크롤바 제거 */
@media (max-width: 1280px) {
  .max-h-screen {
    max-height: none !important;
    overflow-y: visible !important;
  }
}
</style>


