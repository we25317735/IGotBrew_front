import { cookies } from 'next/headers'
import { parseJwt } from '@/services/user'
import { redirect } from 'next/navigation'
import { getUserById, userOrder, userCoupon } from '@/services/user'

// SSR 取得當前使用者資料(沒有則跳回首頁)
export async function getSSRUser() {
  const accessToken = cookies().get('accessToken')
  console.log('ssr cookie: ', accessToken)

  // 沒 token 就跳回首頁
  if (!accessToken?.value) return redirect('/IGotBrew')

  const token = accessToken.value

  let jwtUser

  try {
    jwtUser = parseJwt(token)
    if (!jwtUser?.id) throw new Error('Invalid token')
  } catch {
    return redirect('/IGotBrew')
  }

  // 向後端拿資料
  try {
    const res = await getUserById(jwtUser.id, token)
    const user = res?.data?.data?.user

    if (!user) throw new Error('User not found')
    return user
  } catch {
    return redirect('/IGotBrew')
  }
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
