import { cookies, headers } from 'next/headers'
import { parseJwt } from '@/services/user'
import { redirect } from 'next/navigation'
import {
  getUserById,
  userOrder,
  userCoupon,
  userFavorites,
  checkAuth
} from '@/services/user'




// 測試區域
export async function test_srever() {
const accessToken = cookies().get('accessToken')
  const raw = headers.get
    ? headers.get('cookie') // Fetch API Headers 物件
    : headers['cookie'];    // Express/Node http.IncomingMessage
  const res = await checkAuth()
  console.log("測試: ",res.data,accessToken,raw);
 
  if (res.data.status === 'success') {
    const dbUser = res.data.data.user

   console.log("取得使用者: ",dbUser);
  }
}

// 測試區域

// 新版測試: SSR 取得當前使用者資料(沒有則跳回首頁)
export async function getSSRUser() {
  try {
    const accessToken = cookies().get('accessToken')
    console.log('取得 cookie: ', accessToken)

    if (!accessToken?.value) {
      console.warn('沒有 accessToken cookie')
      return null
    }

    const jwtUser = parseJwt(accessToken.value)
    if (!jwtUser?.id) {
      console.warn('JWT token 無效')
      return null
    }

    const res = await getUserById(jwtUser.id, accessToken.value)
    const user = res?.data?.data?.user

    if (!user) {
      console.warn('找不到使用者')
      return null
    }

    return user
  } catch (err) {
    console.error('getSSRUser 發生錯誤:', err)
    return null
  }
}


// SSR 取得使用者 ID
export async function getSSRUserId() {
  const cookie = cookies().get('accessToken')
  if (!cookie || !cookie.value) redirect('/IGotBrew')

  const jwtUser = parseJwt(cookie.value)
  return { id: jwtUser.id, token: cookie.value } // 如果需要 token 一起用
}

// SSR 取得使用者關注商品
export async function getSSRUserFavorites() {
  const token = cookies().get('accessToken').value
  if (!token) redirect('/IGotBrew')

  const jwtUser = parseJwt(token)
  const res = await userFavorites(jwtUser.id)

  return res.data
}

// SSR 取得使用者購買紀錄
export async function getSSRUserOrder() {
  const token = cookies().get('accessToken').value
  if (!token) redirect('/IGotBrew')

  const jwtUser = parseJwt(token)
  const res = await userOrder(jwtUser.id)

  return res.data.data //回傳使用者基本資料
}

// SSR 取得使用者優惠券
export async function getSSRUserCoupons() {
  const token = cookies().get('accessToken').value
  if (!token) redirect('/IGotBrew')

  const jwtUser = parseJwt(token)
  const res = await userCoupon(jwtUser.id)

  return res.data //回傳使用者基本資料
}
