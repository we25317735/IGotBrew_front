'use client'
import React, { useEffect, useState } from 'react'
import Coupons from '@/components/user_router/coupons'
import Loading from '@/components/Loading'
import { useAuth } from '@/hooks/use-auth' // 取出當前使用者
import { userCoupon } from '@/services/user'

export default function CouponsPage() {
  const [coupon, setCoupon] = useState([]) // 優惠券
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入設定
  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth])

  useEffect(() => {
    if (!auth.isAuth) return

    const getCoupon = async () => {
      const res = await userCoupon(auth.userData.id)
      const data = res.data.data.reverse() // 反轉陣列, 需要反向渲染
      setCoupon(data)
    }

    getCoupon()
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

  return <Coupons user={auth.userData.id} data={coupon} />
}
