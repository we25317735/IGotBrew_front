import React from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'
import useFirebase from '@/hooks/use-firebase'
import { googleLogin, parseJwt, getUserById } from '@/services/user'
import toast from 'react-hot-toast'
import { FaGoogle } from 'react-icons/fa' // google ICON

// google 登入按鈕
export default function Google_btn() {
  const { loginGoogle } = useFirebase()
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // Google 登入後處理
  const callbackGoogleLoginPopup = async (providerData) => {
    if (auth.isAuth) return

    // google 登入 或 註冊+登入 API
    const res = await googleLogin(providerData)

    if (res.data.status === 'success') {
      const jwtUser = parseJwt(res.data.data.accessToken)
      const res1 = await getUserById(jwtUser.id) // 取得 id 後, 調取使用者資料

      // 查詢到該使用者資料後
      if (res1.data.status === 'success') {
        // 把該使用者帶入 content
        setAuth({
          isAuth: true,
          userData: res1.data.data,
        })

        toast.success('google 登入成功')
        router.push('/IGotBrew')
      } else {
        toast.error('登入後無法得到會員資料')
      }
    } else {
      toast.error('登入失敗')
    }
  }

  return (
    <>
      <button
        className="btn d-flex justify-content-center align-items-center p-2 "
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          border: '1px solid #db4437',
          fontSize: '24px',
          color: '#db4437',
          backgroundColor: '#EEE9E4',
        }}
        onClick={() => loginGoogle(callbackGoogleLoginPopup)}
      >
        <FaGoogle />
      </button>
    </>
  )
}
