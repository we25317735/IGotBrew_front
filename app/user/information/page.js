'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth' // 取出當前使用者
import Information from '@/components/user_router/information'
import Loading from '@/components/Loading'
import { getUserById } from '@/services/user'

// 會員中心: 基本資料頁
export default function InformationPage() {
  const [user, setUser] = useState([]) // 使用者資料
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入設定
  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth])

  useEffect(() => {
    if (!auth.isAuth) return

    const getUser = async () => {
      const res = await getUserById(auth.userData.id)
      setUser(res.data.data.user)
    }

    getUser()
  }, [auth])

  // 初始載入 loading
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])

  if (isInitialLoad) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return <Information user={user} />
}
