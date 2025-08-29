// 指數退避 (Exponential Backoff) + 隨機抖動 (Jitter)
export async function requestWithRetry(
  fn,
  retries = 3,
  baseDelay = 1000,
  fallbackData = null
) {
  /*
        fn: 需要重試的函式，應該返回一個 Promise (例如 axios 請求)
        retries: 最大重試次數   
        baseDelay: 基本延遲時間 (毫秒)
        fallbackData: 最終失敗後的預設回傳資料 (前端降級, 但畫面現在沒寫)
    */

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fn()
      console.log('如果成功的話: ', res.data)
      return res.data // 成功直接回傳
    } catch (error) {
      // 如果是最後一次失敗
      if (i === retries - 1) {
        console.error('API 最終失敗:', error.message || error)
        return fallbackData // 回傳預設資料避免前端炸掉
      }

      // 請求失敗後: 指數退避 + 隨機抖動 然後重新請求
      const delay = baseDelay * 2 ** i + Math.random() * 300 // 隨機抖動 (Jitter): 請求失敗後, 打亂請求時間在式一次
      console.log(`重新請求 #${i + 1} in ${delay.toFixed(0)}ms`, error.message)
      await new Promise((resolve) => setTimeout(resolve, delay)) // setTimeout 等待完畢後再重式
    }
  }
}
