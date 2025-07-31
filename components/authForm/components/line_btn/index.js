import React from 'react'
import { SiLine } from 'react-icons/si' // 引入 Line 圖標
import { useAuth } from '@/hooks/use-auth'
import { lineLoginRequest } from '@/services/user'

// LINE 登陸邏輯
const Line_btn = () => {
  const { auth } = useAuth()

  // 處理登入
  const goLineLogin = () => {
    // 判斷是否已經登入，已登入不會再作登入
    if (auth.isAuth) return //如果帳號有東西則不執行

    lineLoginRequest() // 從後端伺服器取得line登入網址
  }

  return (
    <>
      <button
        className="btn d-flex justify-content-center align-items-center p-2"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          border: '1px solid #00C300',
          fontSize: '24px',
          color: '#00C300',
          backgroundColor: '#EEE9E4',
        }}
        onClick={goLineLogin}
      >
        <SiLine />
      </button>
    </>
  )
}

export default Line_btn
