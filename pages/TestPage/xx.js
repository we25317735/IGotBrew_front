import React, { useState, useContext, useEffect } from 'react'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'

export default function Header() {
  const [data, setData] = useState([])

  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分
  const router = useRouter() // 初始化router

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth, router])

  return (
    <>
      <h1>測試: {auth.userData.name}</h1>
    </>
  )
}
