'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth' // 取出當前使用者
import { User, Settings, Coffee, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Skeleton from '@mui/material/Skeleton'

// (使用者有無登入訊息)
export default function Header() {
  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分

  return (
    <div className="member-header">
      <div className="user-info">
        <Avatar className="user-avatar border border-1 rounded-circle">
          <div className="w-100 h-100" style={{ position: 'relative' }}>
            <Image
              src={auth.userData.img}
              className="w-100 h-100"
              alt=" "
              width={100}
              height={100}
            />
            <Skeleton
              animation="wave"
              variant="circular"
              className="w-100 h-100"
              style={{ position: 'absolute', top: '0' }}
              width={100}
              height={100}
            />
          </div>
        </Avatar>
        <div className="user-details">
          <h1 className="user-name">{auth.userData.name}</h1>
          <p className="user-email">會員id: {auth.userData.id}</p>
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
