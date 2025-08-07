import Favorites from '@/components/user_router/favorites'
import { getSSRUserFavorites } from '@/utils/getSSRUser'

export default async function FavoritesPage() {
  const res = await getSSRUserFavorites() // 購物紀錄 API

  return <Favorites data={res.data} user={res.user_id} />
}
