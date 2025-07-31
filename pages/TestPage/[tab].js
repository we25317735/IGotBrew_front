import { useRouter } from 'next/router'

/* 分頁 */
import Page_1 from './Page_1'
import Page_2 from './Page_2'
import Page_3 from './Page_3'

import Error from '@/pages/404' // 404 分頁

const TabPage = () => {
  const router = useRouter()
  const { tab } = router.query

  let PageComponent // 決定要渲染的組件

  switch (tab) {
    case 'Page_1': //路徑名稱
      PageComponent = Page_1 // 把 Page_1 組件丟進 PageComponent 並渲染
      break
    case 'page_2':
      PageComponent = Page_2
      break
    case 'page_3':
      PageComponent = Page_3
      break
    default:
      PageComponent = Error // 找不到路徑時
  }

  return <PageComponent /> // 跳回首頁(主頁的 index.js)
}

export default TabPage
