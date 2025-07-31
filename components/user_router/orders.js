import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'

// 直接做成 SSR 也沒差
export default function Orders({ data }) {
  return (
    <Card className="content-card">
      <CardHeader>
        <CardTitle>購買紀錄</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="orders-list">
          {data.map((e) => (
            <div key={e.id} className="order-item">
              <div className="order-info">
                <div className="order-header">
                  <span className="order-id">
                    {e.product_name} x {e.amount}
                  </span>
                  <Badge
                    className={`order-status ${
                      e.status === '已完成' ? 'completed' : 'shipping'
                    }`}
                  >
                    {e.status}
                  </Badge>
                </div>
                <p className="order-items">訂單 # {e.id}</p>
                <div className="order-footer">
                  <span className="order-date">
                    <Calendar className="w-4 h-4" />
                    {e.created_at}
                  </span>
                  <span className="order-total">${e.amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
