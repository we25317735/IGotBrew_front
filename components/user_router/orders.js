'use client'
import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// 直接做成 SSR 也沒差
export default function Orders({ data }) {
  const [order, setOrder] = useState(data)

  // 根據訂單狀態顯示訊息
  const statusVariantMap = {
    pending: 'pending', // 你在 badgeVariants 定義的 variant 名稱
    paid: 'completed',
    fail: 'fail',
    shipping: 'shipping', // 如果你有 shipping variant
  }

  // 同步來自父組件的 prop (初始會渲染一堆空值)
  useEffect(() => {
    if (data) {
      setOrder(data)
    }
  }, [data])

  console.log('edewefew ', data)

  return (
    <Card className="content-card">
      <CardHeader>
        <CardTitle>購買紀錄</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="orders-list">
          {order.map((e, index) => (
            <div key={index} className="order-item">
              <div className="order-info">
                <div className="order-header">
                  <span className="order-id">
                    {e.product_name} x {e.quantity}
                  </span>
                  <Badge
                    variant={statusVariantMap[e.status] || 'default'}
                    radius="xl"
                    className="order-status"
                    style={{
                      backgroundColor:
                        e.status === 'pending'
                          ? '#f0ad4e'
                          : e.status === 'paid'
                          ? '#2b4f61'
                          : e.status === 'fail'
                          ? '#d9534f'
                          : '#6c757d',
                    }}
                  >
                    {e.status === 'pending'
                      ? '處理中'
                      : e.status === 'paid'
                      ? '已完成'
                      : e.status === 'fail'
                      ? '交易失敗'
                      : e.status}
                  </Badge>
                </div>
                <p className="order-items">
                  訂單
                  <span
                    style={{
                      color:
                        e.status === 'pending'
                          ? '#f0ac4e85'
                          : e.status === 'paid'
                          ? '#2b4f6185'
                          : e.status === 'fail'
                          ? '#d9534f85'
                          : '#6c757d85',
                    }}
                  >
                    # {e.id}
                  </span>
                </p>
                <div className="order-footer">
                  <span className="order-date">
                    <Calendar className="w-4 h-4" />
                    {e.created_at}
                  </span>
                  <span className="order-total me-2">${e.amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
