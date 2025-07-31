import handler from '../pages/api/hello'

test('hello cart!!', () => {
  expect(1 + 1).toBe(2)
})

// describe: 測試區塊
describe('API /api/hello', () => {
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
