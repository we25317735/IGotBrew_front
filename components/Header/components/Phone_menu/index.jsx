import React, { useState, useEffect, useContext } from 'react'
import styles from './asset/style/JunCheng.module.scss'
import { useAuth } from '@/hooks/use-auth'

import arrow2 from './asset/img/arrow_2.png'
import { useRouter, Link } from 'next/router' // 切換路由
import { FaRegArrowAltCircleRight, FaAngleLeft } from 'react-icons/fa'

// 使用者 context
import { AuthContext } from '@/context/AuthContext'

export default function PhoneMenu({ List_switch = () => {} }) {
  // 使用者部分
  const { auth, setAuth, handleCheckAuth } = useAuth()
  const router = useRouter() // 初始化router

  const { logout, login } = useAuth()
  const [data, setData] = useState([])

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth, router])

  const [item, setItem] = useState('/') // 初始值設置為首頁
  const [animationClass, setAnimationClass] = useState('') // 動畫效果
  const [back_user, setBack_user] = useState(false) // 後臺管理員

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [isMenuOpen])

  // 不同路徑的內容
  const generatePages = (auth) => {
    const basePages = {
      // 首頁
      '/': [
        ['線上商店', 'ONLINE SHOP', 'true', '/Product'],
        ['咖啡專欄', 'ARTICLES', 'false', '/article'],
        ['咖啡地圖', 'CAFE’ MAP', 'false', '/cafeMap'],
        [
          '項目',
          auth && auth.userData.id ? `您好 ${auth.userData.name}` : '使用者',
        ],
        ...(auth && auth.userData.id
          ? [
              ['會員中心', 'MEMBER CENTRE', 'true', '/user'],
              ['登出', 'LOGOUT', 'false', '/logout'],
            ]
          : [
              ['登入', 'LOGIN', 'false', '/login'],
              ['註冊', 'REGISTER', 'false', '/login'],
            ]),
        ...(auth && auth.userData.permissions == 1
          ? [['後台管理', 'ADMIN', 'false', '/anal']]
          : []),
      ],
      // 商品
      '/Product': [
        ['返回', '', '', '/'],
        ['所有商品', 'ALL PRODUCTS', 'false', '/product'],
        ['咖啡人的必修課', 'COURSES for COFFEE LOVERS', 'false', '/course'],
        ['咖啡豆', 'COFFEE BEANS', 'false', '/product?type=bean'],
        ['咖啡機', 'MACHINE', 'false', '/product?type=machine'],
        ['其他/配件', 'OTHERS', 'false', '/product?type=other'],
      ],

      // 商品: 咖啡豆
      // '/Product/beans': [
      //   ['返回', '', '', '/Product'],
      //   ['所有咖啡豆', 'ALL COFFEE BEANS', 'false', '/Product/beans/all'],
      //   ['淺、中烘焙咖啡豆', 'LIGHT ROASTED', 'false', '/Product/beans/light'],
      //   ['深、中烘焙咖啡豆', 'DARK ROASTED', 'false', '/Product/beans/dark'],
      // ],

      // 商品: 機器
      // '/Product/machines': [
      //   ['返回', '', '', '/Product'],
      //   ['所有咖啡機', 'ALL MACHINE', 'false', '/Product/machines/all'],
      //   ['Nespresso系列', 'Nespresso', 'false', '/Product/machines/nespresso'],
      //   ['PANASONIC系列', 'PANASONIC', 'false', '/Product/machines/panasonic'],
      //   ['PHILIPS系列', 'PHILIPS', 'false', '/Product/machines/philips'],
      // ],

      // 使用者
      '/User': [
        ['返回', '', '', '/'],
        ['個人設定', 'ALL MACHINE', 'false', '/user/user_data'],
        ['交易紀錄', 'Nespresso', 'false', '/user/user_order'],
        ['好康折扣', 'PANASONIC', 'false', '/user/user_coupon'],
        ['按讚好物', 'PHILIPS', 'false', '/user/user_like'],
      ],
    }

    // GotBrew 後臺管理
    // if (auth && auth.userData.permissions == 1) {
    //   basePages['/GotBrew_back'] = [
    //     ['返回', '', '', '/'],
    //     ['商品管理', 'ALL MACHINE', 'false', '/productEditor'],
    //     ['課程管理', 'Nespresso', 'false', '/courseEditor'],
    //     ['文章管理', 'PANASONIC', 'false', '/articleEditor'],
    //   ]
    // }
    return basePages
  }

  const pages = generatePages(auth)

  // 點擊事件處理
  const itemChoose = (e, path, action) => {
    e.preventDefault()
    if (action) {
      action()
      return
    }
    const validPaths = Object.keys(pages)

    if (validPaths.includes(path)) {
      // 判斷當前頁面及目標頁面順序
      const currentIndex = Object.keys(pages).indexOf(item)
      const nextIndex = Object.keys(pages).indexOf(path)

      if (nextIndex > currentIndex) {
        // 下一頁在當前頁面之後從右滑入
        setAnimationClass(`${styles['slide-out-to-left']}`)
        setTimeout(() => {
          setItem(path)
          setAnimationClass(`${styles['slide-in-from-right']}`)
        }, 200)
      } else {
        // 下一頁在當前頁面之前,從左滑入
        setAnimationClass(`${styles['slide-out-to-right']}`)
        setTimeout(() => {
          setItem(path)
          setAnimationClass(`${styles['slide-in-from-left']}`)
        }, 200)
      }
    } else {
      if (path === '/logout') {
        logout()
        router.reload()
        router.push('http://localhost:3000/IGotBrew')
      } else {
        List_switch(null)
        router.push(path)
      }
    }
  }

  // 根據當前路徑顯示對應的頁面內容
  let current_page = pages[item] || pages['/']

  return (
    <div
      className={`${styles['Mobile-menu']} ${isMenuOpen ? styles['open'] : ''}`}
    >
      <ul className={`${animationClass}`}>
        {current_page.map((e, index) =>
          e[0] === '返回' ? (
            // 返回按鈕
            <li
              className={`${styles['back-btn']}`}
              key={index}
              onClick={(event) => itemChoose(event, e[3])}
            >
              <a href={e[3]} style={{ display: 'flex', alignItems: 'center' }}>
                <FaAngleLeft />
                <p>回上一層 BACK</p>
              </a>
            </li>
          ) : e[0] === '項目' ? (
            <li key={index} className={`${styles['item']}`}>
              <p>{e[1]}</p>
            </li>
          ) : (
            <li key={index} onClick={(event) => itemChoose(event, e[3])}>
              <a href={e[3]}>
                <div
                  className={`${styles['item-box']}
                      `}
                >
                  <p>{e[0]}</p>
                  <p>{e[1]}</p>
                </div>
                {e[2] === 'true' ? (
                  <div>
                    <FaRegArrowAltCircleRight />
                  </div>
                ) : null}
              </a>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
