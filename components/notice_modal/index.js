import { useEffect, useState, useRef } from 'react'
import styles from './assets/style.module.scss'

export default function NoticeModal() {
  const [showModal, setShowModal] = useState(false) // 掛勾 localStorage, 測試時 true
  const [checked, setChecked] = useState(false) // 確認按鈕
  const [canCheck, setCanCheck] = useState(false) // 是否可勾選 checkbox
  const noticeRef = useRef(null) // 監聽滾動的容器

  // 組件載入時檢查時間有沒有過
  useEffect(() => {
    const lastRead = localStorage.getItem('announcement')
    // const ONE_DAY = 24 * 60 * 60 * 1000 // 24 小時毫秒數
    const ONE_DAY = 5 * 60 * 1000 // 5 分鐘毫秒數

    if (lastRead) {
      const lastTime = parseInt(lastRead, 10)
      if (Date.now() - lastTime > ONE_DAY) {
        // console.log("超過 24 小時，需要顯示 modal")
        setShowModal(true)
      } else {
        // console.log("還沒超過 24 小時，不顯示 modal")
        setShowModal(false)
      }
    } else {
      // 沒有紀錄，第一次進來也要顯示
      // console.log("沒有紀錄，第一次顯示 modal")
      setShowModal(true)
    }
  }, [])

  useEffect(() => {
    const noticeDiv = noticeRef.current
    if (!noticeDiv) return

    function onScroll() {
      if (
        noticeDiv.scrollTop + noticeDiv.clientHeight >=
        noticeDiv.scrollHeight - 1
      ) {
        setCanCheck(true)
      }
    }

    // 確保 scrollHeight 正確
    if (noticeDiv.scrollHeight > noticeDiv.clientHeight) {
      noticeDiv.addEventListener('scroll', onScroll)
    } else {
      // 內容太短，直接允許勾選
      setCanCheck(true)
    }

    return () => {
      noticeDiv.removeEventListener('scroll', onScroll)
    }
  }, [showModal]) // 加 showModal 為依賴，確保 modal 出現時才綁定事件

  const handleConfirm = () => {
    localStorage.setItem('announcement', Date.now().toString())
    setShowModal(false)
  }

  return (
    <div className={styles.warp}>
      {showModal && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <div className={styles.modalContent}>
            <h2 id="modalTitle">閱讀事項</h2>
            <div
              className={styles.noticeText}
              ref={noticeRef}
              style={{ overflowY: 'auto', maxHeight: '200px' }} // 確保能滾動
            >
              <p>
                1.
                本專案創立於資策會，由本人和四位同學於就學期間一同打造，後續由個人進行程式碼優化與整合,
                在此感謝各位大神們的設計稿與指導
              </p>
              <p>
                2. 網站目前可以進行帳號的創建, 如若不想, 登入區也有提供測試帳號,
                可以直接使用
              </p>
              <p>3. 網頁維護進度: 首頁圖片渲染不順問題處理中</p>
              <p className="text-danger">
                ※ 這網站純粹是前端作品展示，沒有實際購買服務，請盡情測試,
                但不會出貨的
              </p>
              <p className="text-danger">
                ※
                不建議在這裡輸入任何信用卡或敏感資料，個人沒興趣但資料庫會存起來的，安全第一！測試時旁邊有一鍵輸入可供使用
              </p>
              <p className="text-danger">
                ※ 由於是學校作品,
                網站裡用了一堆網路圖片和資料，如果有侵權請告訴我，我會馬上替換掉，感謝合作！
              </p>
            </div>
            <div
              className={`${styles.formCheck} d-flex justify-content-between`}
            >
              <button
                className={styles.confirmBtn}
                disabled={!checked}
                onClick={handleConfirm}
              >
                確認
              </button>

              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  id="agreeCheck"
                  checked={checked}
                  disabled={!canCheck} // 只有滾到底才能勾選
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <label
                  htmlFor="agreeCheck"
                  style={{
                    color: canCheck ? '#000' : '#aaa', // 可點擊時是黑色，不可點擊時用淺灰色
                    cursor: canCheck ? 'pointer' : 'not-allowed',
                    userSelect: canCheck ? 'auto' : 'none', // 防止選取文字
                  }}
                >
                  我已閱讀並同意
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
