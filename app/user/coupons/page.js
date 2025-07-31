import Coupons from '@/components/user_router/coupons'
import { getSSRUserCoupons } from '@/utils/getSSRUser'

export default async function CouponsPage() {
  const res = await getSSRUserCoupons() // 使用者優惠券 API

  return <Coupons data={res} />
}
