'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/hooks/use-auth' // 取出當前使用者
import { userOrder } from '@/services/user'

import Orders from '@/components/user_router/orders'
import Loading from '@/components/Loading'

export default function OrderPage() {
  const [data, setData] = useState([]) // 使用者資料
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入設定
  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth])

  useEffect(() => {
    if (!auth.isAuth) return

    const getOrder = async () => {
      const res = await userOrder(auth.userData.id)
      setData(res.data.data.results)
      return
    }

    getOrder()
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

  return <Orders data={data} />
}
