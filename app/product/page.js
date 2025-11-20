import ProductClient from './product-client'
import axios from 'axios'
import 'dotenv/config.js'


// SSR 共用資料取得函數
async function fetchJson(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' }) 
    if (!res.ok) {
      console.error(`API request failed with status ${res.status}: ${url}`)
      return { status: 'error', data: {} }
    }
    return res.json()
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error)
    return { status: 'error', data: {} }
  }
}

// 商品頁面, 入口
export default async function ProductPage({ searchParams }) {
  const Mock = process.env.MOCK_DATA // 本地測試開關

  // 空白資料, 測試模式時可啟動 
  if (Mock === 'true') {
    return (
      <ProductClient
        findProduct={[]}
        hotProducts={[]}
        topRatedProducts={[]}
        specialProducts={[]}
        findTotalPages={1}
        findNewPages={1}
        query_type=""
        find=""
        sort=""
      />
    )
  }

  // 取得 url 參數
  const find = searchParams.find || ''
  const type = searchParams.type || ''
  const page = searchParams.page || '1'
  const sort = searchParams.sort || ''

  // ssr 訊息取得
  const [findsData, hotData, topRatedData, specialsProduct] =
    await Promise.all([
      fetchJson(
        `${process.env.NEXT_PUBLIC_BACK_API}/product?find=${find}&type=${type}&sort=${sort}&page=${page}`
      ),
      fetchJson(`${process.env.NEXT_PUBLIC_BACK_API}/product/hot-products`),
      fetchJson(`${process.env.NEXT_PUBLIC_BACK_API}/product/top-rated`),
      fetchJson(`${process.env.NEXT_PUBLIC_BACK_API}/product/special`),
    ])

  // 共用 api 資料處理函數
  const extractProducts = (e) => {
    return e.status === 'success' && e.data && Array.isArray(e.data.products)
      ? e.data.products
      : []
  }

  // SSR 資料傳入 prop
  const props = {
    findProduct: extractProducts(findsData),
    hotProducts: extractProducts(hotData),
    topRatedProducts: extractProducts(topRatedData),
    specialProducts: extractProducts(specialsProduct),
    findTotalPages: findsData?.data?.totalPages || 1,
    findNewPages: findsData?.data?.currentPage || 1,
    query_type: type,
    find: find,
    sort: sort,
  }


  return <ProductClient {...props} />
}
