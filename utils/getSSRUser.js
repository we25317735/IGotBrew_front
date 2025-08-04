import { cookies, headers } from 'next/headers'
import { parseJwt } from '@/services/user'
import { redirect } from 'next/navigation'
import { getUserById, userOrder, userCoupon } from '@/services/user'

// 新版測試: SSR 取得當前使用者資料(沒有則跳回首頁)
export async function getSSRUser() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  console.log('所有 cookie:', [...cookieStore]) // 檢查有沒有 cookie
  console.log('ssr 有沒有取得: ', accessToken)

  if (!accessToken) return redirect('/IGotBrew')

  return user
}

// SSR 取得使用者 ID
export async function getSSRUserId() {
  const cookie = cookies().get('accessToken')
  if (!cookie || !cookie.value) redirect('/IGotBrew')

  const jwtUser = parseJwt(cookie.value)
  return { id: jwtUser.id, token: cookie.value } // 如果需要 token 一起用
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

  return res.data.data //回傳使用者基本資料
}
