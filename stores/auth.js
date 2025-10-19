import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,     // 로그인 상태
    user: null,               // 사용자 정보  
    loading: true,            // 로딩 상태
    authInitialized: false    // 인증 초기화 상태
  }),

  actions: {
    // 인증 상태 초기화
    async init() {
      const { $auth, $db } = useNuxtApp()
      
      return new Promise((resolve) => {
        onAuthStateChanged($auth, async (user) => {
          if (user) {
            // 1. 로그인한 사용자가 있을 경우
            try {
              // Firestore에서 사용자 정보 가져오기
              const userDoc = await getDoc(doc($db, 'users', user.uid))
              if (userDoc.exists()) {
                // Firestore에서 사용자 정보가 있을 경우 사용자 정보 설정
                const userData = userDoc.data()
                this.setUser(user, userData.name, userData.role)
              } else {
                // Firestore에서 사용자 정보가 없을 경우
                console.log('신규 회원가입 처리 중입니다.')
                this.setUser(null)
              }
            } catch (error) {
              console.error('사용자 정보 로드 실패:', error)
              this.setUser(null)
            }
          } else {
            // 2. 로그인한 사용자가 없을 경우
            this.setUser(null)
          }
          resolve()  // Promise 완료
        })
      })
    },

    // 사용자 정보 설정 :  사용자 정보를 Pinia store에 설정하는 메서드
    setUser(user, name = null, role = null) {
      // 1. 사용자가 정보가 있을 경우
      if (user) {
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: name || user.displayName,
          role: role || 'user'
        }
        this.authenticated = true
      } else {
        // 2.사용자 정보가 없을 경우
        this.user = null
        this.authenticated = false
      }
      // 3. 공통상태 업데이트
      this.loading = false // 로딩 상태 업데이트
      this.authInitialized = true  // 인증 초기화 완료 표시
    },

    // 로그인 처리
    async handleLogin(email, password) {
      const { $auth, $db } = useNuxtApp()
      try {
        // 1. Firebase Authentication으로 사용자 로그인
        const userCredential = await signInWithEmailAndPassword($auth, email, password)
        // 2. Firestore에서 사용자 정보 가져오기
        const userDoc = await getDoc(doc($db, 'users', userCredential.user.uid))
        
        // 3. 사용자 정보가 없을 경우 예외 처리
        if (!userDoc.exists()) {
          throw new Error('사용자 정보를 찾을 수 없습니다.')
        }
        
        // 4. 사용자 정보 설정
        const userData = userDoc.data()
        this.setUser(userCredential.user, userData.name, userData.role)

        // 5. 로그인 성공 시 사용자 정보 반환
        return userCredential.user
      } catch (error) {
        console.error('로그인 실패:', error)
        console.error('에러 코드:', error.code)
        console.error('에러 메시지:', error.message)
        console.error('전체 에러 객체:', error)
        throw error
      }
    },

    // 회원가입 처리
    async handleSignup(email, password, name) {
      const { $auth, $db } = useNuxtApp()
      try {
        // 1. Firebase Authentication으로 사용자 생성
        const userCredential = await createUserWithEmailAndPassword($auth, email, password)
        const user = userCredential.user
        
        // 2. Firebase Authentication 프로필 업데이트
        await updateProfile(user, { displayName: name })
        
        // 3. Firestore에 사용자 정보 저장
        const userData = {
          uid: user.uid,
          email: email,
          name: name,
          role: 'user',
          createdAt: new Date().toISOString()
        }
        
        await setDoc(doc($db, 'users', user.uid), userData)
        
        // 4. 회원가입 완료 후 로그아웃 처리
        await signOut($auth)
        this.setUser(null)
        
        // 5. 회원가입 성공 시 사용자 정보 반환
        return user
      } catch (error) {
        // 에러 발생 시 생성된 계정 삭제 시도
        try {
          if ($auth.currentUser) {
            await $auth.currentUser.delete()
          }
        } catch (deleteError) {
          console.error('사용자 계정 삭제 실패:', deleteError)
        }
        
        console.error('회원가입 실패:', error)
        throw error
      }
    },

    // 로그아웃 처리
    async logout() {
      const { $auth } = useNuxtApp()
      try {
        // 1. Firebase Authentication에서 로그아웃 처리
        await signOut($auth)
        // 2. Pinia store에서 사용자 정보 초기화
        this.setUser(null)
      } catch (error) {
        console.error('로그아웃 실패:', error)
        throw error
      }
    },

    // 비밀번호 재설정
    async resetPassword(email) {
      const { $auth } = useNuxtApp()

      try {
        // Firebase Authentication에서 비밀번호 재설정 이메일 발송
        await sendPasswordResetEmail($auth, email)
      } catch (error) {
        console.error('비밀번호 재설정 이메일 발송 실패:', error)
        throw error
      }
    },

    // 아이디 찾기
    async findUserId(name) {
      // 1. Firestore 데이터베이스 참조
      const { $db } = useNuxtApp()
      try {
        // 2. 사용자 컬렉션 참조
        const usersRef = collection($db, 'users')
        // 3. 이름 조건 쿼리 생성
        const q = query(usersRef, where('name', '==', name))
        // 4. 쿼리 실행 및 결과 가져오기
        const querySnapshot = await getDocs(q)
        // 5. 결과 처리
        if (querySnapshot.empty) {
          throw new Error('일치하는 사용자 정보를 찾을 수 없습니다.')
        }

        const userDoc = querySnapshot.docs[0]
        const userData = userDoc.data()
        return userData.email
      } catch (error) {
        console.error('아이디 찾기 실패:', error)
        throw error
      }
    },

    // 이메일 중복 체크
    async checkEmailExists(email) {
      const { $db } = useNuxtApp()
      try {
        // Firestore에서 이메일 중복 체크
        const usersRef = collection($db, 'users')
        const q = query(usersRef, where('email', '==', email)) 
        const querySnapshot = await getDocs(q)
        
        // 2. 결과 처리
        return !querySnapshot.empty
      } catch (error) {
        console.error('이메일 중복 체크 실패:', error)
        throw error
      }
    },

    // 모든 사용자 목록 조회 (디버깅용)
    async getAllUsers() {
      const { $db } = useNuxtApp()
      try {
        console.log('=== Firestore 사용자 목록 조회 시작 ===')
        const usersRef = collection($db, 'users')
        const querySnapshot = await getDocs(usersRef)
        
        console.log(`총 ${querySnapshot.size}명의 사용자가 등록되어 있습니다.`)
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data()
          console.log(`- UID: ${userData.uid}`)
          console.log(`  이메일: ${userData.email}`)
          console.log(`  이름: ${userData.name}`)
          console.log(`  역할: ${userData.role}`)
          console.log(`  생성일: ${userData.createdAt}`)
          console.log('---')
        })
        
        console.log('=== Firestore 사용자 목록 조회 완료 ===')
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      } catch (error) {
        console.error('사용자 목록 조회 실패:', error)
        throw error
      }
    }
  },
  
  getters: {
    isAuthenticated: (state) => state.authenticated,
    currentUser: (state) => state.user,
    currentUserRole: (state) => state.user?.role,
    isLoading: (state) => state.loading
  }
})