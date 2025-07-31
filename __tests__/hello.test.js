import handler from '../pages/api/hello'

// 是的，你的 Jest 測試已經成功執行！
// 你可以再針對 /pages/api/hello.js 增加一個 API handler 的單元測試：

// describe: 測試區塊
describe('handler API 測試', () => {
  it('如果成功回傳 200', () => {
    // 模擬 req, res
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    // 呼叫 handler
    handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200) //
    expect(res.json).toHaveBeenCalledWith({ name: 'John Doe' })
  })
})

test('hello world!', () => {
  expect(1 + 1).toBe(2)
})
