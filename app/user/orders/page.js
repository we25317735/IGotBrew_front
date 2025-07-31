import Orders from '@/components/user_router/orders'
import { getSSRUserOrder } from '@/utils/getSSRUser'

export default async function OrderPage() {
  const res = await getSSRUserOrder() // 購物紀錄 API
  const data = res.results

  return <Orders data={data} />
}
