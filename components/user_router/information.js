'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { updateProfile } from '@/services/user'
import { sanitizeInput } from '@/utils/safety' // 安全小工具

export default function Information({ user }) {
  const [data, setData] = useState(user) // 頁面資料

  // 更新欄位
  const stateChang = (e) => {
    const { id, value } = e.target
    setData((prev) => ({ ...prev, [id]: value }))
  }

  // 資料修改1: 資料格式驗證
  const handleSave = () => {
    //
    const updatedFields = {}
    for (const key in user) {
      // 更新的資料和 prop 對照
      if (data[key] !== user[key]) {
        updatedFields[key] = data[key]
      }
    }

    /* 項目驗證部分 */
    if ('name' in updatedFields && /\d/.test(updatedFields.name)) {
      toast.error('姓名不能包含數字')
      return
    }

    if ('phone' in updatedFields && !/^\d{9,10}$/.test(updatedFields.phone)) {
      toast.error('電話號碼格式錯誤，請輸入 9~10 位數字')
      return
    }

    if (
      'email' in updatedFields &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedFields.email)
    ) {
      toast.error('電子郵件格式不正確')
      return
    }

    // 驗證結束, 在送出前清理 XSS
    const cleanedData = {}
    for (const key in updatedFields) {
      cleanedData[key] = sanitizeInput(updatedFields[key])
    }

    dataChange(cleanedData) // 安全資料送出
  }

  // 資料修改2: 發 API 請求
  const dataChange = async (data) => {
    let API_data = {
      id: user.id, // 加上使用者 id
      ...data,
    }

    const res = await updateProfile(API_data)

    if (res.data.status === 'success') {
      toast.success('更改成功')
    }
  }

  return (
    <Card className="content-card">
      <CardHeader>
        <CardTitle>基本資料</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="email">電子郵件</label>
            <input
              id="email"
              type="email"
              value={data.email || ''}
              onChange={stateChang}
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthday">生日</label>
            <input
              id="birthday"
              type="date"
              value={data.birthday || ''}
              onChange={stateChang}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">電話號碼</label>
            <input
              id="phone"
              type="text"
              value={data.phone || ''}
              onChange={stateChang}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">地址</label>
            <input
              id="address"
              type="text"
              value={data.address || ''}
              onChange={stateChang}
            />
          </div>
          <div className="form-group">
            <span className="form-label-placeholder" />
            <Button
              onClick={handleSave}
              className="member-badge"
              style={{ course: 'porint' }}
            >
              修改
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
