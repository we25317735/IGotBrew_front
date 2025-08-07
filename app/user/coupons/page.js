import Coupons from '@/components/user_router/coupons'
import { getSSRUserCoupons } from '@/utils/getSSRUser'

export default async function CouponsPage() {
  const res = await getSSRUserCoupons() // 使用者優惠券 API
  const data = res.data.reverse() // 反轉陣列, 需要反向渲染

  return <Coupons data={data} user={res.user_id} />
}
