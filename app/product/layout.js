// 網站 head 標籤設定
export async function generateMetadata({ params }) {
  // 如果需要根據參數動態生成標籤，可以在這裡使用 params
  //   const productId = params.id
  //   const res = await fetch(`https://your-api.com/products/${productId}`)
  //   const product = await res.json()

  return {
    title: '商品列表 | IGotBrew',
    description: '探索我們的咖啡商品，包括咖啡豆、咖啡機與更多好物。',
    keywords: '咖啡, 咖啡豆, 商品, IGotBrew',
    openGraph: {
      title: '商品列表 | IGotBrew',
      description: '探索我們的咖啡商品，包括咖啡豆、咖啡機與更多好物。',
      images: ['https://yourdomain.com/images/og-image.jpg'],
      url: 'https://yourdomain.com/product',
    },
  }
}

// 商品頁布局
export default function ProductLayout({ children }) {
  return <>{children}</>
}
