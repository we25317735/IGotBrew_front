'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import '@/styles/user.scss'
import { useCart } from '@/hooks/use-cart'
import toast, { Toaster } from 'react-hot-toast'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Favorites({ data, user }) {
  const [product, setProduct] = useState(data)
  const { addItem } = useCart() // 購物車 hook

  // 加入購物車
  const handleAddToCart = (e) => {
    // 購物車通用物件
    const cartItem = {
      user: user,
      classification: 'product',
      id: e.id,
      name: e.name,
      img: e.img,
      price: Math.floor(e.price * e.discount), // 必要, 用來計算總金額
      quantity: 1, // 點一次 +1
    }

    addItem(cartItem) // 丟進購物車

    toast.success('加入購物車') // 成功後跳訊息
  }

  return (
    <Card className="content-card">
      <CardHeader>
        <CardTitle>我的最愛</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="favorites-grid">
          {data.map((e) => (
            <div key={e.id} className="favorite-item">
              <img
                src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${e.img}`}
                alt={e.name}
                className="favorite-image"
              />
              <div className="favorite-info">
                <h3 className="favorite-name">
                  <Link
                    href={`/product/${e.id}`}
                    className="hover-css text-decoration-none "
                  >
                    {e.name.length > 30 ? e.name.slice(0, 30) + '...' : e.name}
                  </Link>
                </h3>
                <p className="favorite-price">$ {e.price}</p>
              </div>
              <Button
                onClick={() => handleAddToCart(e)}
                size="sm"
                className="add-to-cart-btn"
              >
                加入購物車
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
