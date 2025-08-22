'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth' // 取出當前使用者
import Favorites from '@/components/user_router/favorites'
import Loading from '@/components/Loading'
import { userFavorites } from '@/services/user'

export default function FavoritesPage() {
  const [product, setProduct] = useState([]) // 關注商品
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入設定
  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth])

  useEffect(() => {
    if (!auth.isAuth) return

    const getFavorites = async () => {
      const res = await userFavorites(auth.userData.id) // 關注的商品(與商品細節頁共用 API)
      setProduct(res.data.data)
    }

    getFavorites()
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

  return <Favorites user={auth.userData.id} product={product} />
}
