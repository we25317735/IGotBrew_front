'use client'
import React, { useState, useEffect } from 'react'
import { Gift } from 'lucide-react'
import Swal from 'sweetalert2'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { receiveCoupon } from '@/services/user'

export default function Coupons({ data, user }) {
  const [coupons, setCoupons] = useState(data)

  // 同步來自父組件的 prop (初始會渲染一堆空值)
  useEffect(() => {
    if (data) {
      setCoupons(data)
    }
  }, [data])

  // 領取優惠券 API
  const getCoupon = async (coupon) => {
    let couponData = {
      user_id: user, // 領取人
      coupon_id: coupon.id, // 優惠券 id
      end_time: coupon.end_time, // 優惠截止日
    }

    const res = await receiveCoupon(couponData) // 領取優惠券 API

    // 優惠券取得成功
    if (res.data.status === 'success') {
      Swal.fire({
        title: '成功取得優惠券!',
        icon: 'success',
        confirmButtonText: 'OK',
      })

      // 模擬成功後更新優惠券狀態
      setCoupons((prev) =>
        prev.map(
          (c) => (c.id === coupon.id ? { ...c, state: '可使用' } : c) // 領取後, 改變優惠券的狀態
        )
      )
    }
  }

  return (
    <>
      {/* 可領取優惠券 */}
      <Card className="content-card">
        <CardHeader>
          <CardTitle>會員獎勵 (4)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="coupons-list">
            {coupons
              .filter((coupon) => coupon.state === '可領取')
              .map((coupon, index) => (
                <div key={index} className="coupon-item">
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
                      <p className="coupon-expiry">
                        有效期限: {coupon.end_time}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={
                      new Date(coupon.end_time) < new Date()
                        ? 'used'
                        : 'default'
                    }
                    disabled={new Date(coupon.end_time) < new Date()}
                    className="use-coupon-btn"
                    onClick={() => {
                      if (new Date(coupon.end_time) < new Date()) return // 過期不執行
                      getCoupon(coupon) // 領取優惠券 API
                    }}
                  >
                    {new Date(coupon.end_time) < new Date()
                      ? '已過期'
                      : '可領取'}
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
            {coupons
              .filter((coupon) => coupon.state === '可使用')
              .map((coupon, index) => (
                <div key={index} className="coupon-item">
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
                      <p className="coupon-expiry">
                        有效期限: {coupon.end_time}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={
                      new Date(coupon.end_time) < new Date()
                        ? 'used'
                        : 'default'
                    }
                    className="use-coupon-btn"
                  >
                    {new Date(coupon.end_time) < new Date()
                      ? '已過期'
                      : '可使用'}
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
