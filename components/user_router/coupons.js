'use client'
import React from 'react'
import { Gift } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Coupons({ data }) {
  const coupons = [
    {
      id: 1,
      title: '新會員專享',
      discount: '9折優惠',
      expiry: '2024-02-28',
      code: 'NEW2024',
    },
    {
      id: 2,
      title: '滿千免運',
      discount: '免運費',
      expiry: '2024-03-15',
      code: 'FREE2024',
    },
  ]

  console.log('資料: ', data)

  return (
    <>
      {/* 可領取優惠券 */}
      <Card className="content-card">
        <CardHeader>
          <CardTitle>會員獎勵 (4)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="coupons-list">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="coupon-item">
                <div className="coupon-content">
                  <div className="coupon-discount">
                    <Gift className="coupon-icon" />
                    <span className="discount-text">{coupon.value}</span>
                  </div>
                  <div className="coupon-details">
                    <h3 className="coupon-title">{coupon.title}</h3>
                    <p className="coupon-code">活動: {coupon.discount}</p>
                    <p className="coupon-expiry">有效期限: {coupon.expiry}</p>
                  </div>
                </div>
                <Button size="sm" className="use-coupon-btn">
                  領取
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 可使用優惠券 */}
      <Card className="content-card mt-5">
        <CardHeader>
          <CardTitle>可用優惠券</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="coupons-list">
            {data.map((coupon) => (
              <div key={coupon.id} className="coupon-item">
                <div className="coupon-content">
                  <div className="coupon-discount">
                    <Gift className="coupon-icon" />
                    <span className="discount-text">
                      {coupon.type === 'percent'
                        ? `${coupon.value * 10}折優惠`
                        : `${coupon.value} 元折價`}
                    </span>
                  </div>
                  <div className="coupon-details">
                    <h3 className="coupon-title">{coupon.name}</h3>
                    <p className="coupon-code">活動: {coupon.description}</p>
                    <p className="coupon-expiry">有效期限: {coupon.end_time}</p>
                  </div>
                </div>
                <Button size="sm" className="use-coupon-btn">
                  可使用
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
