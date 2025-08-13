import React, { useState, useEffect } from 'react'
import styles from './assets/style/style.module.scss'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'

import { lineLoginCallback, getUserById, parseJwt } from '@/services/user'

import Card from './components/card'
import Loading from '@/components/Loading'

// 登入介面渲染 + 第三方登入 callBack 回傳(url query 部分)
export default function AuthForm({ mode }) {
  const [isLoading, setIsLoading] = useState(false)
  // const [isLoading, setIsLoading] = useState(true)
  const [check_user, setCheck_user] = useState(true) // 檢查有無用戶(確認 handleCheckAuth 有執行完)
  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分
  const router = useRouter()

  // 使用者確認1: 確保 handleCheckAuth() 完全跑完後再執行後續
  useEffect(() => {
    const checkAuth = async () => {
      await handleCheckAuth()
      setCheck_user(false)
    }

    checkAuth()
  }, [setAuth])

  // 使用者確認2: check_user 變更後, 再確認有無使用者登入
  useEffect(() => {
    if (check_user) return

    if (auth.isAuth) {
      toast.error('使用者已登入')
      router.replace('/IGotBrew') // 沒有的話跳回首頁
    } else {
      setIsLoading(false) // 沒有使用者, 關閉 loading 進入登入頁
    }
  }, [check_user])

  // 第三方登入 callBack 回傳
  useEffect(() => {
    // setIsLoading(true) // 有接收到 query 時, 一律以 loading 畫面執行
    if (router.isReady) {
      if (!router.query.code) return // 沒有 code 表示非登入狀態(code 是 line 其中一個狀態)

      /* 後續新增條件可加入其他第三方(或許吧??) */
      callbackLineLogin(router.query) // 處理 LINE 登入回調
    }
  }, [router.isReady, router.query])

  // LINE 登入回調: callBack 後續處理
  const callbackLineLogin = async (query) => {
    const res = await lineLoginCallback(query)

    console.log('回傳: ', query)

    if (res.data.status === 'success') {
      // 從 JWT 解析會員資料
      const jwtUser = parseJwt(res.data.data.accessToken)
      const res1 = await getUserById(jwtUser.id)

      if (res1.data.status === 'success') {
        const dbUser = res1.data.data.user
        const userData = { ...initUserData }

        // 將資料表中的會員資料與 initUserData 中的屬性值進行對應
        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }

        // 更新全域的會員狀態
        setAuth({
          isAuth: true,
          userData,
        })

        toast.success('LINE 登入成功')
        router.push('/IGotBrew') // 登入成功後跳轉到首頁
      } else {
        toast.error('登入後無法取得會員資料')
      }
    } else {
      toast.error('LINE 登入失敗或已是登入狀態')
      router.push('/IGotBrew') // 失敗後還是跳轉到首頁
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className={`${styles['login-wrap']} `}>
      <div className="container my-auto">
        <div className={`${styles.container} row  `}>
          {/* 左側區塊 */}
          <div
            className={`${styles['left-section']} col-12 col-md-7 d-flex flex-column justify-content-between`}
          >
            {/* LOGO */}
            <div className={`${styles['logo-container']} `} >
              <div className={styles['logo-placeholder']}>
                <div className={styles['logo-icon']}>
                  <span>L</span>
                </div>
                <div className={styles['logo-divider']}></div>
                <div className={styles['logo-text']}>
                  <div className={styles['text-line']}></div>
                  <div className={styles['text-line']}></div>
                  <div className={styles['text-line']}></div>
                </div>
              </div>
            </div>

            {/* 歡迎文字 */}
            <div className={`${styles['welcome-text']}} `}>
              <h1>歡迎回來</h1>
              <p>登入您的帳戶，探索我們的咖啡網站，感受專案的血與淚。</p>
            </div>

            {/* 商品卡片 */}
            <div className={`${styles['featured-products']}`}>
              {['A', 'B', 'C'].map((item, index) => (
                <div key={index} className={styles['product-card']}>
                  <div className={styles['product-image']}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.67 18.95L7.6 15.64C8.39 15.11 9.53 15.17 10.24 15.78L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9"
                      />
                    </svg>
                  </div>
                  <div className={styles['product-info']}>
                    <h3>精選商品 {item}</h3>
                    <div className={styles.price}>
                      {item === 'A'
                        ? 'NT$ 1,200'
                        : item === 'B'
                        ? 'NT$ 1,500'
                        : 'NT$ 980'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右側登入卡片 */}
          <div className={`${styles['right-section']} col-12 col-md-5`}>
            <div className={`${styles['card-box']}  mb-5 mb-md-0`}>
              <Card mode={mode} />
            </div>
          </div>
        </div>
      </div>

      {/* 吐司 */}
      <Toaster />
    </div>
  )
}
