import React, { useState, useContext, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/services/axios-instance'
import { checkAuth } from '@/services/user'

const AuthContext = createContext(null)

// 使用者資訊 (user 表單有啥可以全寫進來)
export const initUserData = {
  id: 0,
  username: '',
  google_uid: '',
  line_uid: '',
  name: '',
  email: '',
  img: '',

  birthday: '',
  city: '',
  area: '',
  address: '',
  phone: '',
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuth: false,
    userData: initUserData,
  })

  // 每次 reload 都會抓取資料
  const handleCheckAuth = async () => {
    const res = await checkAuth() // 用 cookie 來確認使用者(http會傳送瀏覽器所有cookie, 後端那邊指名找哪個即可)

    if (res.data.status === 'success') {
      const dbUser = res.data.data.user
      const userData = { ...initUserData }

      for (const key in userData) {
        if (Object.hasOwn(dbUser, key)) {
          userData[key] = dbUser[key] || ''
        }
      }

      setAuth({ isAuth: true, userData })
    } else {
      // console.warn(res.data)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        handleCheckAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
