import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { loadingON, loadingOff } from '@/utils/gadgets'
import axiosInstance from '@/services/axios-instance'
import Loading from '@/components/Loading'
import styles from './assets/style.module.scss'

export default function ForgotPassword() {
  const [password, setPassword] = useState('') // 密碼輸入
  const [passwordErr, setPasswordErr] = useState('') // 錯誤或成功訊息
  const [passwordCheck, setPasswordCheck] = useState(false) // 是否通過檢查
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入設定
  const [token, setToken] = useState('')
  const router = useRouter()

  // 先把 url 的 token 變數搞到手
  useEffect(() => {
    if (!router.isReady) return

    if (router.query.token) {
      setToken(router.query.token) // 抓到的 token 先放 state, 後續改密碼要用
      Certification(router.query.token) // 搞到後開始認證
    }
  }, [router.isReady, router.query])

  // 先對載入的 token 進行認證
  const Certification = async (token) => {
    // 連接同一支 API, 先驗證 url 進來的 token
    const res = await axiosInstance.get('/auth/check', {
      headers: { Authorization: `Bearer ${token}` },
    })

    // token 驗證結果回傳
    if (res.data.status === 'success') {
      toast.success('驗證成功, 進入修改頁')
    } else if (res.data.status === 'error') {
      // 這邊應該放 404 頁面
      toast.error('發生錯誤, 請稍後在式 !!!')
    } else if (res.data.status === 'expired') {
      // 這邊應該放 404 頁面
      toast.error('存取令牌已過期，請重新在式 !!!')
    }
  }

  // 密碼設定
  useEffect(() => {
    if (!password) {
      // 初始或清空時，不顯示訊息，按鈕禁用
      setPasswordErr('')
      setPasswordCheck(false)
      return
    }

    if (password.length < 6) {
      setPasswordErr('❌ 密碼太短，至少需要6個字元')
      setPasswordCheck(false)
      return
    }

    if (!/[a-z]/.test(password)) {
      setPasswordErr('❌ 密碼需要至少一個小寫字母')
      setPasswordCheck(false)
      return
    }

    if (!/\d/.test(password)) {
      setPasswordErr('❌ 密碼需要至少一個數字')
      setPasswordCheck(false)
      return
    }

    setPasswordErr('✅ 密碼設定可以')
    setPasswordCheck(true)
  }, [password])

  // 更改密碼按鈕
  const handleSubmit = async (e) => {
    e.preventDefault()

    loadingON('密碼修改認證中')

    // 修改密碼的 API,
    const res = await axiosInstance.post(
      '/auth/reset_password',
      { password },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    loadingOff()

    if (res.data.status === 'success') {
      toast.success('修改成功，需重新登入')
      router.push('/login') // 跳回登入頁
    } else {
      toast.error('存取令牌已過期，請重新在式 !!!')
    }
  }

  // 初始載入 loading
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])

  // isInitialLoad 後續變更
  if (isInitialLoad) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <div className={styles.warp}>
      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className={styles.card}>
          <h2 className="text-center mb-4">IGotBrew</h2>
          <p className="text-center">歡迎回來, </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                請輸入您的新密碼
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="請設定您的密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* 錯誤或成功提示 */}
            {passwordErr && (
              <p
                className={`fs-6 ${
                  passwordCheck ? 'text-success' : 'text-danger'
                }`}
              >
                {passwordErr}
              </p>
            )}

            <button
              type="submit"
              disabled={!passwordCheck}
              className="btn w-100"
            >
              發送
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
