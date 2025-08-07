'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { updateProfile, getUserById } from '@/services/user'
import { sanitizeInput } from '@/utils/safety' // 安全小工具

export default function Information({ user }) {
  const [data, setData] = useState(user) // 頁面資料
  const [editedData, setEditedData] = useState(false) // 資料有無修改
  const [reductionData, setReductionData] = useState(false) // 還原資料按鈕

  // 更新欄位
  const stateChang = (e) => {
    const { id, value } = e.target
    setData((prev) => {
      const newData = { ...prev, [id]: value }
      // 如果目前輸入的值不同於原始 user，表示有修改
      const isModified = newData[id] !== user[id]
      setEditedData(isModified)
      setReductionData(isModified)
      return newData
    })
  }

  // 資料修改1: 資料格式驗證
  const handleSave = () => {
    const updatedFields = {} // 用來存放有變更的欄位

    for (const key in user) {
      // 更新的資料和 prop 對照
      if (data[key] !== user[key]) {
        updatedFields[key] = data[key]
      } else {
        // 這邊保留(SSR 不會隨著每次更新而改變)
        // delete updatedFields[key]  // 如果沒有變更，則不需要更新
      }
    }

    // 用 updatedFields 判斷資料有無更新
    if (Object.keys(updatedFields).length === 0) {
      toast.error('沒有任何資料修改')
      return
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
      setEditedData(false) // 關閉編輯按鈕
      setReductionData(false) // 關閉還原按鈕
      toast.success('更改成功')
    }
  }

  // 取消編輯(資料還原)
  const editetCancel = async () => {
    /* CSR 有更改資料庫, 但不會因此更改 SSR, 所以還是要叫 API */
    const res = await getUserById(user.id) // 重新從後端取得使用者資料
    setData(res.data.data.user) // 還原資料
    setReductionData(false) // 還原按鈕關閉
    toast.success('資料已還原')
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
            <div className="d-flex">
              <button
                type="button"
                onClick={handleSave}
                className="member-badge btn "
                disabled={editedData ? false : true}
                style={{
                  cursor: 'pointer',
                  backgroundColor: editedData ? '#2b4f61' : '#666',
                  border: editedData ? 'solid 2px #2b4f61' : 'solid 2px #666',
                }}
              >
                更 新
              </button>
              <button
                type="button"
                onClick={editetCancel}
                className="member-badge ms-4 btn"
                disabled={reductionData ? false : true}
                style={{
                  cursor: 'pointer',
                  backgroundColor: reductionData ? '#2b4f61' : '#666',
                  border: reductionData
                    ? 'solid 2px #2b4f61'
                    : 'solid 2px #666',
                }}
              >
                取 消
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
