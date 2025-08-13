import React, { useState, useEffect, useContext, useRef } from 'react'
import Header from '@/components/Header'
import Section1 from './section1'
import Section2 from './section2'
import Section3 from './section3'
import Section4 from './section4'
import Section4Phone from './section4Phone'
import Section5 from './section5'
import Section6 from './section6'
import Footer from '@/components/Footer'
import styles from './assets/style/style.module.scss'
import Loading from '@/components/Loading'
import { FaAngleUp } from 'react-icons/fa'

import NoticeModal from '@/components/notice_modal' // 新增 import

export default function IGotBrew() {
  const [showButton, setShowButton] = useState(false)
  const sectionsRef = useRef([])
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入 loading
  const [visibleSections, setVisibleSections] = useState({}) // 記錄哪個組件已進入視界
  const [allSectionsRendered, setAllSectionsRendered] = useState(false) // 判斷所有組件是否渲染完成

  // 所有需要載入的組件
  const sections = [
    Section2,
    Section3,
    Section4,
    Section4Phone,
    Section5,
    Section6,
    Footer,
  ]

  // 滾輪監聽
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GO TO TOP 按鈕
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      // 檢查該元素是否進入可視區域（畫面）
      if (entry.isIntersecting) {
        // 從元素的 dataset 中取得預先設定的 index 編號
        const index = entry.target.dataset.index

        // 更新 visibleSections 狀態，標記該 index 的 section 已進入畫面
        setVisibleSections((prev) => ({
          ...prev,
          [index]: true,
        }))

        // 停止觀察這個元素，避免重複觸發
        observer.unobserve(entry.target)
      }
    })
  }

  // ✅ 這個 useEffect 的作用是：在所有 section 元素都渲染出來之後，開始用 IntersectionObserver 來監控它們是否進入畫面（viewport）
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    }

    if (allSectionsRendered) {
      // ✅ 確保所有 section（區塊）都已經渲染完畢才初始化觀察器
      //    這個 flag 是在 section 被設置 ref 時確認用的

      // ✅ 建立 IntersectionObserver 實例，並傳入處理交集事件的 callback 和選項
      const observer = new IntersectionObserver(handleIntersect, options)

      // ✅ 逐一處理所有的 section 元素（透過 ref 拿到）
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          // ✅ 設定 data-index 屬性，把 section 的索引記錄下來
          //    這樣在 handleIntersect 裡就能知道是哪一個區塊觸發了觀察事件
          section.dataset.index = index.toString()

          // ✅ 開始觀察這個 section 是否進入視窗
          observer.observe(section)

          // console.log(`正在觀察 section ${index}`)
        } else {
          // ❌ 有些 section 尚未正確綁定 ref
          // console.log(`Section ${index} is null or undefined`)
        }
      })

      // 🧹 清除函式：元件 unmount 或依賴變化時取消觀察，避免記憶體外洩
      return () => {
        sectionsRef.current.forEach((section) => {
          if (section) {
            // ❌ 停止觀察該元素
            observer.unobserve(section)
          }
        })
      }
    }
  }, [allSectionsRendered]) // ✅ 只有當 allSectionsRendered 為 true 時才執行

  useEffect(() => {
    // console.log('當前可見的 Sections:', visibleSections)
  }, [visibleSections])

  // 初始載入 loading
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])

  // 初始載入 loading
  if (isInitialLoad) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <>
      {/* 注意事項，放在最上層 */}
      <NoticeModal />

      <div className={`container-fluid ${styles['bg']}`}>
        <Header />
        <Section1 />
        {sections.map((Section, index) => (
          <div
            key={index}
            ref={(el) => {
              sectionsRef.current[index] = el
              // console.log(`Setting ref for section ${index}:`, el)
              if (
                sectionsRef.current.filter(Boolean).length === sections.length
              ) {
                setAllSectionsRendered(true)
              }
            }}
            className={`${styles.sectionWrapper} ${
              visibleSections[index] ? styles.visible : ''
            }`}
          >
            <Section />
          </div>
        ))}

        {/* GO TO TOP 按鈕 */}
        {showButton && (
          <button onClick={scrollToTop} className={`${styles.gototop} btn`}>
            <FaAngleUp />
            <br /> Top
          </button>
        )}
      </div>
    </>
  )
}

// (上線在開)SSG: 只要有寫 getStaticProps() 就好, 在 build 時會執行此函式，產生靜態頁面
export async function getStaticProps() {
  console.log('getStaticProps 執行') // 這裡只會在 build 時執行，不會在瀏覽器

  return {
    props: {}, // 如果有資料要傳的話可以用
  }
}
