import { getSSRUser } from '@/utils/getSSRUser'
import Information from '@/components/user_router/information'

// 會員中心: 基本資料頁(SSR)
export default async function InformationPage() {
  const user = await getSSRUser() // 取得使用者資料( SSR 渲染)

  return <Information user={user} />
}
