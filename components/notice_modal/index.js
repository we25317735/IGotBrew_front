import { useEffect, useState, useRef } from 'react'
import styles from './assets/style.module.scss'

export default function NoticeModal() {
  const [showModal, setShowModal] = useState(false) // 掛勾 sessionStorage, 測試時 true
  const [checked, setChecked] = useState(false)
  const [canCheck, setCanCheck] = useState(false) // 是否可勾選 checkbox

  const noticeRef = useRef(null) // 監聽滾動的容器

  useEffect(() => {
    if (!sessionStorage.getItem('readNotice')) {
      setShowModal(true)
    }
  }, [])

  useEffect(() => {
    const noticeDiv = noticeRef.current
    if (!noticeDiv) return

    function onScroll() {
      // 判斷是否滾動到底：scrollTop + clientHeight >= scrollHeight - 1（允許誤差）
      if (
        noticeDiv.scrollTop + noticeDiv.clientHeight >=
        noticeDiv.scrollHeight - 1
      ) {
        setCanCheck(true)
      }
    }

    noticeDiv.addEventListener('scroll', onScroll)

    return () => {
      noticeDiv.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleConfirm = () => {
    sessionStorage.setItem('readNotice', 'true')
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
                本專案創立於資策會，由本人和四位大神於就學期間一同打造，並在後期維護程式碼和
                API 等功能
              </p>
              <p>
                2. 目前維護內容為 "商品頁" , "購物車" 及註冊登入相關事宜,
                後續將持續維護課程及文章部分！
              </p>
              <p>
                3.
                網站目前登入購物功能都能"正常"使用，但還在開發中，難免會有些小狀況，請多包涵啦～
              </p>
              <p>
                4. 會員中心目前已撰寫成型，但因 Cookie 與跨網域問題，暫時無法對外開放。開放時程將延至個人購買獨立網域後（致歉：租用型子網域存在 Cookie 存取限制，加上本人目前經濟狀況有限，尚無法購買域名）
              </p>
              <p className="text-danger">
                ※ 這網站純粹是前端作品展示，沒有實際購買服務，請盡情測試,
                但不會出貨的
              </p>
              <p className="text-danger">
                ※
                不建議在這裡輸入任何信用卡或敏感資料，咱個人沒興趣但資料庫會存起來的，安全第一！測試時旁邊有一鍵輸入可供使用
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
