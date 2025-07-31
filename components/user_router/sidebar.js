'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation' // app 路由要改用 navigation
import { User, ShoppingBag, Heart, Gift, ChevronRight } from 'lucide-react' // 項目圖示

import 'dotenv/config.js' // .env 檔案載入(共用api部分)

// 會員中心: 左側列表部分
export default function Sidebar() {
  const [active, setActive] = useState('profile') // 當前項目
  const router = useRouter()
  const pathname = usePathname()

  // 列表項目
  const items = [
    {
      id: 'information',
      title: '基本資料',
      icon: User,
      description: '管理個人資訊',
    },
    {
      id: 'orders',
      title: '購買紀錄',
      icon: ShoppingBag,
      description: '查看訂單歷史',
    },
    {
      id: 'favorites',
      title: '我的最愛',
      icon: Heart,
      description: '收藏的商品',
    },
    {
      id: 'coupons',
      title: '優惠券',
      icon: Gift,
      description: '可用優惠券',
    },
  ]

  // 檢視 url 並變更渲染
  useEffect(() => {
    if (!pathname) return

    const prefix = '/user/' // 以 user 路由為開頭
    const validIds = items.map((item) => item.id) // 取得所有現有的頁面

    // 如果 user 後面沒有接東西,
    if (pathname === '/user' || pathname === '/user/') {
      router.push('/user/information') // 導向到基本資料頁
      return
    }

    // 根據 user 後面的東西跳轉 url
    if (pathname.startsWith(prefix)) {
      const subPath = pathname.slice(prefix.length).split('/')[0] // 取得 user 後面第一個參數(比方: /orders/ )

      if (validIds.includes(subPath)) {
        setActive(subPath) // 改當前 active
      }
    }
  }, [pathname])

  // 切換項目
  const active_change = (e) => {
    setActive(e) // 切換項目
    router.push(`/user/${e}`) // 不用 process.env, next 自己會加上「目前網域」
  }

  return (
    <div className="member-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => {
            active_change(item.id) // 切換項目部分
          }}
        >
          <div className="nav-content">
            <item.icon className="nav-icon" />
            <div className="nav-text">
              <span className="nav-title">{item.title}</span>
              <span className="nav-description">{item.description}</span>
            </div>
          </div>
          <ChevronRight className="nav-arrow" />
        </button>
      ))}
    </div>
  )
}
