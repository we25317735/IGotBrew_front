import '@/styles/normalize.css'
// import '../styles/globals.css' // tw css
// import '../styles/main.scss'
import '@/styles/globals.scss'

import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Notice_modal from '@/components/notice_modal'

// 目前用不到的
// import '@/styles/loader.scss'
// import '@/styles/product.scss'
// import '@/styles/cart.scss'

// content 引入
import { AuthProvider_1 } from '@/context/AuthContext' // 購物車有用到, 姑且留著

// Hook 引入
import { CartProvider } from '@/hooks/use-cart' // 購物車 Context
import { AuthProvider } from '@/hooks/use-auth' // Google 登入
import { LoaderProvider } from '@/hooks/use-loader' // 載入動畫 Context
import { CatLoader } from '@/hooks/use-loader/components' // 自訂用載入

// 俊成的 Redux 引入
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

export default function MyApp({ Component, pageProps }) {
  // 使用自訂在頁面層級的版面(layout)
  const getLayout = Component.getLayout || ((page) => page)

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  return (
    // 把 3 個 Hook(模板的) + 1 個 Redux + ben token hook 放進來
    <>
      {/* 吐司 */}
      <Toaster />

      {/* 公告 */}
      {/* <Notice_modal />  */}

      <AuthProvider>
        <AuthProvider_1>
          <LoaderProvider close={2} CustomLoader={CatLoader}>
            <Provider store={store}>
              <CartProvider>
                {getLayout(<Component {...pageProps} />)}
              </CartProvider>
            </Provider>
          </LoaderProvider>
        </AuthProvider_1>
      </AuthProvider>
    </>
  )
}
