import React from 'react'
import { useRouter } from 'next/router'
import { FaTwitter } from 'react-icons/fa'
import useFirebase from '@/hooks/use-firebase'
import { useAuth } from '@/hooks/use-auth'
import { TwitterLogin, parseJwt, getUserById } from '@/services/user'
import toast from 'react-hot-toast'

export default function Twitter_btn() {
  const { loginTwitter } = useFirebase()
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // Twitter 登入後處理
  const callbackTwitterLoginPopup = async (providerData) => {
    if (auth.isAuth) return

    const res = await TwitterLogin(providerData)

    if (res.data.status === 'success') {
      const jwtUser = parseJwt(res.data.data.accessToken)
      const res1 = await getUserById(jwtUser.id)

      if (res1.data.status === 'success') {
        setAuth({
          isAuth: true,
          userData: res1.data.data, // 如果格式正確就直接用
        })

        toast.success('Twitter 登入成功')
        router.push('/IGotBrew') // 同 Google，統一為 /IGotBrew（或你要用 /home 也可以）
      } else {
        toast.error('登入後無法得到會員資料')
      }
    } else {
      toast.error('登入失敗')
    }
  }

  return (
    <button
      className="btn d-flex justify-content-center align-items-center"
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        border: '1px solid #1DA1F2',
        fontSize: '24px',
        color: '#1DA1F2',
        backgroundColor: '#EEE9E4',
      }}
      onClick={() => loginTwitter(callbackTwitterLoginPopup)}
    >
      <FaTwitter />
    </button>
  )
}
