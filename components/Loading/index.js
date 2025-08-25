import React from 'react'
import styles from './assets/style/style.module.scss'
import Lottie from 'lottie-react'
import coffeeloading from './coffee loading.json'
export default function Loading() {
  return (
    <>
      <div
        id={`${styles['Loading']}`}
        style={{
          background: '#EEE9E4',
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          zIndex: 99,
          top: 0,
          left: 0,
        }}
      >
        <div className={`${styles['talk-img']}`}>
          <Lottie
            animationData={coffeeloading}
            loop={true}
            autoplay={true}
            style={{ height: 400, width: 800 }}
          />
        </div>
      </div>
    </>
  )
}

//引用loading畫面複製貼上下面就可以
//import Loading from '@/components/Loading'
// const [loading, setLoading] = useState(true)
// useEffect(() => {
//   const timer = setTimeout(() => {
//     setLoading(false)
//   }, 1500)

//   return () => clearTimeout(timer)
// }, [])

// if (loading) {
//   return (
//     <div>
//       <Loading />
//     </div>
//   )
// }
