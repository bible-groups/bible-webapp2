// 임시 마이그레이션 스크립트
// Firebase 콘솔에서 직접 실행하거나, 개발자 도구에서 실행 가능

const migrateUserData = async () => {
  const { $auth, $db } = useNuxtApp()
  
  const oldDocId = 'Ufb5aXYmCbVegjpQKTBA01QPmfq2'
  const newDocId = 'bn0wlkTkzSVLPeIsaWk1CBp6xl83'
  
  try {
    // 기존 문서 데이터 가져오기
    const oldDoc = await getDoc(doc($db, 'users', oldDocId))
    
    if (oldDoc.exists()) {
      const userData = oldDoc.data()
      
      // 새 UID로 문서 생성
      await setDoc(doc($db, 'users', newDocId), {
        ...userData,
        uid: newDocId // UID 업데이트
      })
      
      console.log('사용자 데이터 마이그레이션 완료')
      
      // 기존 문서 삭제 (선택사항)
      // await deleteDoc(doc($db, 'users', oldDocId))
    }
  } catch (error) {
    console.error('마이그레이션 실패:', error)
  }
}

// 실행하려면 아래 주석 해제
// migrateUserData()


