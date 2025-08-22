'use client'

import '@/styles/normalize.css'
import '@/styles/globals.scss'
import '@/styles/globals.scss'

import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

// Context Providers
import { AuthProvider_1 } from '@/context/AuthContext' // 你的舊 Auth
import { AuthProvider } from '@/hooks/use-auth' // Google 登入
import { CartProvider } from '@/hooks/use-cart'
import { LoaderProvider } from '@/hooks/use-loader'
import { CatLoader } from '@/hooks/use-loader/components'

// Redux
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

export default function RootLayout({ children }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  return (
    <html lang="zh-Hant">
      <body>
        {/* 吐司通知 */}
        <Toaster />

        {/* Context Providers（巢狀順序與 pages/_app.js 相同） */}
        <AuthProvider>
          <AuthProvider_1>
            <Provider store={store}>
              <CartProvider>{children}</CartProvider>
            </Provider>
          </AuthProvider_1>
        </AuthProvider>
      </body>
    </html>
  )
}
