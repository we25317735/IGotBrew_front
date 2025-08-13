import React from 'react'
import { User, Settings, Coffee, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getSSRUser } from '@/utils/getSSRUser'

// (使用者有無登入訊息)
export default async function Header() {
  const user = await getSSRUser() // 取得使用者資料( SSR 渲染)

  return (
    <div className="member-header">
      <div className="user-info">
        <Avatar className="user-avatar border border-1 rounded-circle">
          <div className="w-100 h-100">
              <img src={user.img} className="w-100" alt="使用者頭像" />
          </div>
          
        </Avatar>
        <div className="user-details">
          <h1 className="user-name">{user.name}</h1>
          <p className="user-email">會員id: {user.id}</p>
          <div className="user-stats">
            <div className="stat-item">
              <Coffee className="stat-icon" />
              <span>咖啡愛好者</span>
            </div>
            <div className="stat-item">
              <Star className="stat-icon" />
              <span>VIP 會員</span>
            </div>
          </div>
        </div>
      </div>
      <Button className="edit-profile-btn">
        <Settings className="w-4 h-4 mr-2" />
        編輯資料
      </Button>
    </div>
  )
}
