import * as Sentry from '@sentry/nextjs'

export default function SentryExamplePage() {
  const throwError = () => {
    try {
      myUndefinedFunction() // 故意錯誤
    } catch (error) {
      Sentry.captureException(error) // 傳給 Sentry
      console.error(error) // console 也能看到
    }
  }

  return (
    <div>
      <h1>Sentry 測試頁面</h1>
      <button onClick={throwError}>觸發錯誤</button>
    </div>
  )
}
