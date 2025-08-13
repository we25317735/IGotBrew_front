import axiosInstance, { fetcher } from './axios-instance'

// 調取會員狀態(畫面每次 reload 都會執行一次, handleCheckAuth 會執行的那個)
export const checkAuth = async () => {
  // console.log("有沒有跑 token 認證");
  return await axiosInstance.get('/auth/check')
}

// Google 登入(Firebase)登入用，providerData為登入後得到的資料
export const googleLogin = async (providerData = {}) => {
  return await axiosInstance.post('/google-login', providerData)
}

/* Twitter 登入(firebase) */
export const TwitterLogin = async (providerData = {}) => {
  return await axiosInstance.post('/twitter-login', providerData)
}

// line 登入用，導向到line登入頁
export const lineLoginRequest = async () => {
  // 向後端(express/node)伺服器要求line登入的網址，因密鑰的關係需要由後端產生
  axiosInstance.get('/line-login/login').then((res) => {
    console.log('line 導向: ', res.data.url)
    // 重定向到line 登入頁
    if (res.data.url) {
      window.location.href = res.data.url
    }
  })
}

// line 登入, callback 處理
export const lineLoginCallback = async (query) => {
  const qs = new URLSearchParams({
    ...query,
  }).toString()

  return await axiosInstance.get(`/line-login/callback?${qs}`)
}

// LINE 登出用(跟 firebaes 無關, 所以另外處理)
export const lineLogout = async (line_uid) => {
  return await axiosInstance.get(`/line-login/logout?line_uid=${line_uid}`)
}

// 一般會員登入(信箱 或 手機 登入)
export const login = async (loginData) => {
  return await axiosInstance.post('/auth/login', loginData)
}

// 登出用
export const logout = async () => {
  return await axiosInstance.post('/auth/logout', {})
}

// 純測試連線
export const getUser = async () => {
  return await axiosInstance.get(`/user`)
}

// 用使用者 id 去搜尋該筆使用者資訊(SSR + CSR)
export const getUserById = async (id, token = '') => {
  const config = {} // 空物件, 可保留「沒有 token」的情況, 持續 CSR 渲染

  // SSR 時, 需要手動帶入 token
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    }
  }

  return await axiosInstance.get(`/user/${id}`, config)
}

// email 搜尋該使用者
export const getUserByEmail = async (email) => {
  return await axiosInstance.get(`/user/email/${email}`)
}

// 電話 搜尋該使用者
export const getUserByPhone = async (phone) => {
  return await axiosInstance.get(`/user/phone/${phone}`)
}

// 一般會員註冊
export const registerUser = async (data) => {
  return await axiosInstance.post(`/auth/register`, data)
}

// 隨機驗證碼寄信
export const sendEmailVerify = async (data) => {
  return await axiosInstance.post(`/user/email-verify`, data)
}

// 信箱搜尋使用者(忘記密碼)
export const emailFindUser = async (data) => {
  return await axiosInstance.get(`/user/email/${data}`)
}

// 忘記密碼寄信
export const forgetPassword = async (email) => {
  return await axiosInstance.post('/auth/forget_password', 
    {email}
  )
}

// 忘記密碼 修改
export const resetPassword = async (token) => {
  return axiosInstance.post('/auth/reset_password', {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

/**
 * 註冊用
 */
export const register = async (user = {}) => {
  return await axiosInstance.post('/users', user)
}

// 修改會員資料用(請排除password, username, email)
export const updateProfile = async (data) => {
  return await axiosInstance.put(`/user/updata`, data)
}

// 使用者歷史訂單
export const userOrder = async (id) => {
  return await axiosInstance.get(`/user/${id}/order`)
}

// 使用者關注商品
export const userFavorites = async (id) => {
  return await axiosInstance.get(`/user/${id}/favorites`)
}

// 關注的商品(有3條岔路)
export const userAttention = async (id, classification) => {
  return await axiosInstance.get(`/user/${id}/${classification}_like`)
}

// 使用者持有優惠券
export const userCoupon = async (id) => {
  return await axiosInstance.get(`/user/${id}/coupon`)
}

// 領取優惠券
export const receiveCoupon = async (data) => {
  return await axiosInstance.post(`/user/receiveCoupon`, { data })
}

// 解析accessToken用的函式
export const parseJwt = (token) => {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64')
  return JSON.parse(payload.toString())
}
