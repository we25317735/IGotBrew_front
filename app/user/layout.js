'use client'
import React, { useEffect, useState, useRef } from 'react'
import Sidebar from '@/components/user_router/sidebar'
import UserHeader from '@/components/user_router/header'
import Header_redesign from '@/components/Header_redesign'

import Loading from '@/components/Loading'

import '../user/assets/style/globals.css'
import '../user/assets/style/style.scss'

export default function userLayout({ children }) {
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入設定

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

  return (
    <div className="user-wrap">
      <Header_redesign />
      <div className="member-center">
        <UserHeader />
        <Sidebar />

        <div className="member-content">{children}</div>
      </div>
    </div>
  )
}
