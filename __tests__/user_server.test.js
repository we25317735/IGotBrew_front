import { register } from '@/services/user'

// test('註冊成功', async () => {
//   // 模擬發送一個 POST 請求到 /api/register，並夾帶帳密資料
//   const res = await register(app)
//     .post('localhost:3005/api/auth/register')
//     .send({ account: 'we25317735@gmail.com', password: '12345678' }) // 模擬使用者送出的資料

//   // 期待回傳狀態碼是 200（成功）
//   expect(res.statusCode).toBe(200)

//   // 期待回傳的 JSON 裡面 success 是 true
//   expect(res.body.success).toBe(true)

//   // 期待回傳訊息是「註冊成功」
//   expect(res.body.message).toBe('註冊成功')
// })
