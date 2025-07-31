import React, { useState } from 'react'
import {
  FaHome,
  FaBook,
  FaChalkboardTeacher,
  FaTag,
  FaBars,
} from 'react-icons/fa'
import { PiCoffeeBeanFill } from 'react-icons/pi'
import { useRouter } from 'next/router'
import styles from './assets/style/style.module.scss'

/* 文章編輯器有用到 */

const BackSelect = () => {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={styles.menuContainer}>
      <nav
        className={`${styles.adminMenu} ${isCollapsed ? styles.collapsed : ''}`}
      >
        <ul>
          <li onClick={() => router.push('/anal')}>
            <FaHome />
            <span>後台首頁</span>
          </li>
          <li onClick={() => router.push('/productEditor')}>
            <PiCoffeeBeanFill />
            <span>商品管理</span>
          </li>
          <li onClick={() => router.push('/articleEditor')}>
            <FaBook />
            <span>文章管理</span>
          </li>
          <li onClick={() => router.push('/courseEditor')}>
            <FaChalkboardTeacher />
            <span>課程管理</span>
          </li>
          <li onClick={() => router.push('/couponEditor')}>
            <FaTag />
            <span>優惠券管理</span>
          </li>
        </ul>
      </nav>
      <button className={styles.toggleButton} onClick={toggleMenu}>
        <FaBars /> &nbsp;
        <span>後台選單</span>
      </button>
    </div>
  )
}

export default BackSelect
