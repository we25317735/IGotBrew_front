'use client'
import React, { useEffect, useState, useRef } from 'react'
import Information from './information/page'
import History from './information/page'
import Liked from './information/page'
import Coupons from './information/page'

import { Suspense } from 'react'
import Loading from '@/components/Loading'
import { useAuth } from '@/hooks/use-auth' // 取出當前使用者

export default function MemberCenterPage() {
  return (
    <>
      <h1>隨便寫點啥</h1>
    </>
  )
}
