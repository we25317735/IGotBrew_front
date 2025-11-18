import PageClient from './page-client'
import axios from 'axios'

export default async function ProductDetailPage({ params }) {
  // 從 URL 取得 query 參數(給予預設值避免請求無效)
  const { pid } = params

  // SSR 取得資料
  const [product_res] = await Promise.all([
    axios.get(`${process.env.NEXT_PUBLIC_BACK_API}/product/${pid}`),
  ])

  return (
    <PageClient
      productRes={product_res.data.data} // 主要畫面}
      pid={pid}
    />  
  )
}
