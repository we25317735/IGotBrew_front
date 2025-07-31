// app/user/layout.js
import Sidebar from '@/components/user_router/sidebar'
import UserHeader from '@/components/user_router/header'
import Header_redesign from '@/components/Header_redesign'

import Loading from '@/components/Loading'

import '../user/assets/style/globals.css'
import '../user/assets/style/style.scss'

import { Suspense } from 'react'

export default function userLayout({ children }) {
  return (
    <div className="user-wrap">
      <Header_redesign />
      <div className="member-center">
        <UserHeader />
        <Sidebar />
        {/* 包裹 children 加上 Suspense */}
        <div className="member-content">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </div>
  )
}
