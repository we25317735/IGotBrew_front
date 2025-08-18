import React, { useEffect, useState } from 'react'
import styles from './assets/style/style.module.scss'
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import Swal from 'sweetalert2'
import axios from 'axios'
import toast from 'react-hot-toast'

import { registerUser, parseJwt, getUserById } from '@/services/user'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'

import 'dotenv/config.js' // .env 檔案載入

export default function Register_module() {
  const [registerMethod, setRegisterMethod] = useState('email') // 註冊方式
  const [account, setAccount] = useState('') // 註冊帳號(需要驗證)
  const [password, setPassword] = useState('') // 密碼設定
  const [verifyCode, setVerifyCode] = useState('') // 驗證碼
  const [passwordErr, setPasswordErr] = useState('') // 密碼設定錯誤回傳
  const [passwordCheck, setPasswordCheck] = useState(false) // 控制確認密碼 icon
  const [agreed, setAgreed] = useState(false) // 服務條款確認

  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // 確認密碼設置
  useEffect(() => {
    if (!password) return

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

    // 所有條件都過了才進這裡
    setPasswordErr('')
    setPasswordCheck(true)
  }, [password])

  // 查看有無使用者函數
  const check_user = async () => {
    // API 查詢有無註冊過
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACK_API}/auth/register_check/?user=${account}`
    )

    if (res.data.status === 'exist') {
      return true // 有人註冊了
    } else {
      return false // 可以使用
    }
  }

  // 發送認證碼
  const verify_btn = () => {
    if (!account) return

    // email 認證部分
    if (registerMethod === 'email') {
      // console.log('進行 email 認證: ', account)
      Certification('email')
    }

    // 手機認證部分
    if (registerMethod === 'phone') {
      // console.log('進行手機認證: ', account)
      Certification('phone')
    }
  }

  // 傳送認證碼(email 部分)
  const Certification = async (method) => {
    let response // 接 API 的回傳(取得驗證碼的 API)

    Swal.fire({
      title: '驗證碼發送中',
      text: `發送至: ${account}`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    // 如果沒有輸入帳號
    if (!account || account === '') {
      toast.error(`請輸入${registerMethod}`)
      return
    }

    // 查看會員資料有無該使用者(true: 有)
    const userSearch = await check_user()
    if (userSearch) {
      Swal.close() // 關閉 sweetalert 的 loading

      Swal.fire({
        title: '此帳號已被註冊!',
        text: account,
        icon: 'error',
        confirmButtonText: 'OK',
      })

      return
    }

    // API 取得驗證碼信件
    if (method === 'email' && !userSearch) {
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_API}/user/email`,
        { email: account }
      )
    }

    if (method === 'phone' && !userSearch) {
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_API}/user/phone`,
        { email: account }
      )
    }

    // API 回傳後執行
    if (response.data.status === 'success') {
      Swal.close() // 關閉 sweetalert 的 loading

      Swal.fire({
        title: '以傳送驗證碼!',
        text: '請於時限內使用！',
        icon: 'success',
        confirmButtonText: 'OK',
      })
    }
  }

  // 註冊按鈕1: 驗證碼認證
  const register_btn = async () => {
    Swal.fire({
      title: '帳號驗證中...',
      text: '請稍候',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const data = {
      email: account, // 註冊的帳號(信箱或是手機號碼)
      code: verifyCode, // 驗證碼
    }

    try {
      // 1. 認證碼認證 API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_API}/user/verify`,
        data
      )

      Swal.close() // 關閉 sweetalert 的 loading

      // 2. 驗證成功後,
      if (response.data.status === 'success') {
        register_implement() // 開始註冊流程
      } else {
        Swal.fire({
          title: '驗證失敗',
          text: response.data.message || '請確認驗證碼是否正確',
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    } catch (error) {
      /* 驗證錯誤時執行 */
      Swal.close() // 關閉 sweetalert 的 loading
      Swal.fire({
        title: '系統錯誤',
        text: error.response.data.message || '伺服器異常，請稍後再試',
        icon: 'error',
        confirmButtonText: 'OK',
      })
    }
  }

  // 註冊按鈕2: 帳號註冊, 成功後跳轉首頁
  const register_implement = async () => {
    const data = {
      account: account, // 註冊的帳號(信箱或是手機號碼)
      password: password, // 密碼
    }

    // 1. 註冊 API (自定義的 axios 才會自帶 cookie)
    const res = await registerUser(data)

    // 註冊成功後, 拿回 id 進行解構
    if (res.data.status === 'success') {
      const jwtUser = parseJwt(res.data.data.accessToken)
      const res1 = await getUserById(jwtUser.id) // 取得 id 後, 調取使用者資料

      console.log('fghyuio ', res1)

      // 查詢到該使用者資料後
      if (res1.data.status === 'success') {
        // 把該使用者帶入 content
        setAuth({
          isAuth: true,
          userData: res1.data.data,
        })

        toast.success('註冊成功, 歡迎加入')
        router.push('/IGotBrew')
      } else {
        toast.error('註冊失敗')
      }
    }
  }

  return (
    <div className={`${styles['register-form']}`}>
      <div className={`${styles['register-type-selector']} mt-2`}>
        <input
          type="radio"
          name="registerType"
          id="emailRegisterType"
          checked={registerMethod === 'email'}
          onChange={() => setRegisterMethod('email')}
        />
        <label htmlFor="emailRegisterType">信箱註冊</label>

        <input
          type="radio"
          name="registerType"
          id="phoneRegisterType"
          checked={registerMethod === 'phone'}
          onChange={() => {
            /* 設定了 checked 卻沒給 onChange，React 會視為唯讀欄位並給警告。 */
          }}
        />
        <label htmlFor="phoneRegisterType">手機註冊</label>
      </div>
      <div className="fs-5 text-danger" style={{ marginTop: '-10px' }}>
        ※手機目前不提供驗證, 因為要收費
      </div>
      <div id="registerForms" className="mt-4">
        {/*  表單 */}
        <div id="emailRegisterForm" className="register-form">
          {/* 根據註冊方式渲染不同表單 */}
          {registerMethod === 'email' ? (
            // 信箱註冊表單區塊
            <div className="mb-3">
              <label
                htmlFor="registerEmail"
                className={`${styles['form-label']} form-label`}
              >
                電子郵件
              </label>
              <input
                type="email"
                name="email"
                className={`${styles['form-control']} form-control`}
                id="registerEmail"
                placeholder="請輸入您的電子郵件"
                onChange={(e) => setAccount(e.target.value)}
              />
            </div>
          ) : (
            // 手機註冊表單區塊
            <div className="mb-3">
              <label
                htmlFor="registerPhone"
                className={`${styles['form-label']} form-label`}
              >
                手機號碼
              </label>
              <div className="input-group">
                <select
                  className="form-select"
                  style={{ maxWidth: 100, fontSize: '0.9em' }}
                >
                  <option value="+886">+886 台灣</option>
                  <option value="+86">+86 中國</option>
                  <option value="+852">+852 香港</option>
                  <option value="+81">+81 日本</option>
                </select>
                <input
                  type="tel"
                  className={`${styles['form-control']} form-control`}
                  id="registerPhone"
                  placeholder="請輸入您的手機號碼"
                  onChange={(e) => setAccount(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="mb-3 position-relative">
            <label htmlFor="registerPassword" className="form-label">
              設定密碼
            </label>
            <input
              type="password"
              name="password"
              className={`${styles['form-control']} form-control`}
              id="registerPassword"
              placeholder="請設定您的密碼"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />

            {password.length === 0 ? null : passwordCheck ? (
              <FaCheck
                className="text-success position-absolute"
                style={{
                  top: '55%',
                  right: '15px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
            ) : (
              <FaExclamationTriangle
                className="text-warning position-absolute"
                style={{
                  top: '53%',
                  right: '15px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
            )}
            <div className="form-text">
              密碼長度至少8位，需包含大小寫字母和數字
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              確認密碼
            </label>
            <input
              type="password"
              className={`${styles['form-control']} form-control`}
              id="confirmPassword"
              placeholder="請再次輸入密碼"
            />
          </div>

          {/* 驗證碼部分 */}
          <div className="mb-3">
            <label className="form-label" htmlFor="emailVerificationCode">
              {registerMethod === 'email'
                ? '電子信箱認證'
                : registerMethod === 'phone'
                ? '手機號碼認證'
                : '其他認證'}
            </label>
            <div className="d-flex gap-2">
              <input
                type="text"
                className={`${styles['form-control']} form-control`}
                id="emailVerificationCode"
                placeholder="請輸入驗證碼"
                onChange={(e) => setVerifyCode(e.target.value)}
              />
              <button
                type="button"
                disabled={account.length < 5} // 少於 5 個字就不能點
                className={`btn ${
                  account.length < 5 ? 'btn-secondary' : 'btn-outline-primary'
                }`}
                style={{ whiteSpace: 'nowrap', fontSize: '0.85em' }}
                onClick={verify_btn}
              >
                發送驗證碼
              </button>

         
            </div>
          </div>
        </div>

        {/* 隱私政策確認 */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className={`${styles['form-check-input']} form-check-input`}
            id="agreeTerms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label
            className={`${styles['form-check-label']} form-check-label`}
            htmlFor="agreeTerms"
          >
            我已閱讀並同意
            <a href="#" className="text-decoration-none">
              服務條款
            </a>
            和
            <a href="#" className="text-decoration-none">
              隱私政策
            </a>
          </label>
        </div>

        <div className="d-grid gap-2  ">
          <button
            type="submit"
            className={`btn fs-3 mt-3 ${
              agreed ? 'btn-primary' : 'btn-secondary'
            }`}
            id="registerSubmitBtn"
            disabled={!agreed || !passwordCheck} // 未勾選同意何密碼錯誤時按鈕禁用
            onClick={register_btn}
          >
            註冊
          </button>
        </div>
      </div>
    </div>
  )
}
