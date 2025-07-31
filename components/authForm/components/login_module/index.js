import React, { useState } from 'react'
import styles from './assets/style/style.module.scss'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import axios from 'axios'
import { login, parseJwt, getUserById } from '@/services/user'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'

// 第三方登入組件
import Google_btn from '../google_btn'
import Line_btn from '../line_btn'
import Twitter_btn from '../twitter_btn'

export default function Login_module() {
  const [loginData, setLoginData] = useState({
    account: '', // 帳號部分
    password: '', // 密碼部分
  })
  const [loginError, setloginError] = useState('') // 登入錯誤訊息
  const [passwordError, setPasswordError] = useState('') // 還有幾次機會(密碼錯誤部分)
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // 登入按鈕(邏輯寫在後端)
  const login_btn = async () => {
    // 顯示登入中 loading
    Swal.fire({
      title: '帳號驗證中...',
      text: '請稍候',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    // 前端空值判斷, 可防止無效請求
    if (!loginData.account && !loginData.password) {
      toast.error('請填寫帳號與密碼')
      Swal.close()
      return
    }

    // 登入 API
    const res = await login(loginData)

    if (res) Swal.close() // 有回傳東西後,關閉 loading

    // 登入 API 回傳
    if (res.data.status === 'success') {
      const jwtUser = parseJwt(res.data.data.accessToken)
      const res1 = await getUserById(jwtUser.id) // 取得 id 後, 調取使用者資料

      // 查詢到該使用者資料後
      if (res1.data.status === 'success') {
        // 把該使用者帶入 content
        setAuth({
          isAuth: true,
          userData: res1.data.data,
        })

        toast.success('登入成功')
        router.push('/IGotBrew')
      } else {
        toast.error('登入後無法得到會員資料')
      }
    } else if (res.data.status === 'fail') {
      setPasswordError(res.data.count) // 還有幾次機會
      toast.error(res.data.msg)
      console.log('vewvv ', passwordError)

      // 登入失敗次數過多
      if (passwordError === undefined) {
        toast.error(res.data.msg)
        router.push('/IGotBrew')
      }
    }
  }

  return (
    <div id={`${styles['login-form']}`}>
      <div className="mb-3">
        <label
          htmlFor="loginEmail"
          className={`${styles['form-label']} form-label mt-4`}
        >
          電子郵件或手機號碼
        </label>
        <input
          type="text"
          className={`${styles['form-control']} form-control`}
          id="loginEmail"
          placeholder="請輸入您的電子郵件或手機號碼"
          value={loginData.account}
          onChange={(e) =>
            setLoginData({ ...loginData, account: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor="loginPassword"
          className={`${styles['form-label']} form-label mt-2`}
        >
          密碼
        </label>
        <input
          type="password"
          className={`${styles['form-control']} form-control`}
          id="loginPassword"
          placeholder="請輸入您的密碼"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
        />
      </div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="form-check">
          <input
            className={`${styles['form-check-input']} form-check-input`}
            type="checkbox"
            id="rememberMe"
          />
          <label
            className={`${styles['form-check-label']} form-check-label `}
            htmlFor="rememberMe"
          >
            記住我
          </label>
        </div>
        <a
          href="#"
          className={`${styles['text-decoration-none']} text-decoration-none`}
          style={{ color: '#4e73df', fontSize: '0.85em' }}
        >
          忘記密碼？
        </a>
      </div>
      <div className="d-grid gap-2">
        <button
          type="button"
          className="btn btn-primary fs-3"
          onClick={login_btn}
        >
          登入
        </button>
      </div>

      {/* 第三方登入 */}
      <div className={styles.divider}>
        <span>或使用以下方式登入</span>
      </div>

      <div className={`${styles['social-login']} social-login`}>
        <Google_btn />
        <Line_btn />
        <Twitter_btn />
      </div>
    </div>
  )
}
