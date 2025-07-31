import React from 'react'
// import styles from './assets/style/style.module.scss'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Favorites() {
  const favoriteItems = [
    {
      id: 1,
      name: '衣索比亞 耶加雪菲',
      price: 'NT$ 680',
      image: '/placeholder.svg?height=80&width=80',
    },
    {
      id: 2,
      name: '哥倫比亞 翡翠莊園',
      price: 'NT$ 750',
      image: '/placeholder.svg?height=80&width=80',
    },
  ]

  return (
    <Card className="content-card">
      <CardHeader>
        <CardTitle>我的最愛</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="favorites-grid">
          {favoriteItems.map((item) => (
            <div key={item.id} className="favorite-item">
              <img
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                className="favorite-image"
              />
              <div className="favorite-info">
                <h3 className="favorite-name">{item.name}</h3>
                <p className="favorite-price">{item.price}</p>
              </div>
              <Button size="sm" className="add-to-cart-btn">
                加入購物車
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
