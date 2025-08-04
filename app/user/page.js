import Information from './information/page'
import History from './information/page'
import Liked from './information/page'
import Coupons from './information/page'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Loading from '@/components/Loading'

export default function MemberCenterPage({ searchParams }) {
  const section = searchParams.section || 'profile'

  /* 
    這頁面不知道搞啥, prop 進不來, clg 印不出東西 
    渲染策略: layout 判斷有無使用者後, 剩餘訊息各自 SSR 安排
  */

  return (
    <>
      <Suspense fallback={<Loading />}>
        {/* 基本訊息 */}
        {section === 'profile' && <Information />}

        {/* 購買紀錄 */}
        {section === 'orders' && <History />}

        {/* 按讚商品 */}
        {section === 'favorites' && <Liked />}

        {/* 優惠券 */}
        {section === 'coupons' && <Coupons />}
      </Suspense>
    </>
  )
}
