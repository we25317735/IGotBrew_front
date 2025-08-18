import { useRouter } from 'next/router'
import { loadingON, loadingOff } from '@/utils/gadgets'

// 取代 next Link 標籤的東西
export default function LoadLink({
  href,
  title = '載入中',
  msg = '請稍候...',
  children,
  className = '',
  style = {},
}) {
  const router = useRouter()

  const onClick = async (e) => {
    e.preventDefault()
    loadingON(title, msg)
    try {
      await router.push(href)
    } finally {
      loadingOff()
    }
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={className}
      style={{ cursor: 'pointer', ...style }}
    >
      {children}
    </a>
  )
}

