import React, { useEffect, useState } from 'react'
import { TestAPI } from '@/services/user'

// API 呼叫, 防止前端請求炸掉
export default function Api_retry() {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    console.log('API 呼叫中, 請稍後...')

    const fetchData = async () => {
      const res = await TestAPI()

      if (res.status === 'success') {
        console.log('API 呼叫成功:', res)
        setMsg(res.message)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <h1>api 防爆測試</h1>
      <p>{msg}</p>
    </>
  )
}
