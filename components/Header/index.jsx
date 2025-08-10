'use client'
import React, { useState, useContext, useEffect } from 'react'
import styles from './asset/style/nini.module.scss' // 使用 SCSS 模組
import Phone_menu from './components/Phone_menu/index' // 使用 SCSS 模組
import { FaShoppingCart, FaBars, FaSearch } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCart } from '@/hooks/use-cart'
import { FaUserCircle } from 'react-icons/fa'
import Image from 'next/image'
import { Button } from 'react-bootstrap'
import { Button as MuiButton } from '@mui/material'
import { logout, lineLogout } from '@/services/user'

import useFirebase from '@/hooks/use-firebase' // google 登出
import Loading from '../Loading' // loading 畫面
import SiteWide_search from './components/SiteWide_search' // loading 畫面
import LoadLink from '@/components/LoadLink' // 取代 next 的 Link 標籤

// 會員資料( initUserData 用於重置狀態)
import { useAuth, initUserData } from '@/hooks/use-auth'
import toast from 'react-hot-toast' // 吐司

import 'dotenv/config.js' // .env 檔案載入(共用api部分)

export default function Header() {
  const [isMobile, setIsMobile] = useState(false)
  const [animationClass, setAnimationClass] = useState('') // 動畫效果
  const [animationToggle, setAnimationToggle] = useState(false) // 動畫效果開關(失敗維修中...)
  const [isShopList, setIsShopList] = useState(false) // 線上商店 開關
  const [cart, setCart] = useState([]) // 購物車內容渲染
  const [isOpen, setIsOpen] = useState(false) // 購物車 hover 開關
  const [loading, setLoading] = useState(false) // 點擊直到切換的過渡

  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分
  const { logoutFirebase } = useFirebase() // google 登出
  const { cartItems, totalItems } = useCart() // 購物車 hook
  const router = useRouter() // 初始化router

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth])

  // 動畫效果
  const List_switch = (e) => {
    e?.preventDefault()

    if (animationToggle) {
      document.body.classList.remove(`${styles['no-scroll']}`)
      setAnimationClass(`${styles['slide-out']}`)
      setTimeout(() => {
        setAnimationToggle(!animationToggle)
        setAnimationClass('')
      }, 300)
    } else {
      setAnimationClass(`${styles['slide-in']}`)
      setAnimationToggle(!animationToggle)
      setAnimationToggle(true)
    }
  }

  // 使用者登出
  const Logout_btn = async () => {
    logoutFirebase() // 有 Firebase 時執行 Firebase 系列的登出

    const res = await logout() // 登出 API (清除 cookie)

    if (res.data.status === 'success') {
      toast.success('已成功登出')

      // 使用者 context 重制
      setAuth({
        isAuth: false,
        userData: initUserData,
      })

      // 跳轉至登入頁面
      router.push('/login')
    } else {
      toast.error('Google 登出失敗')
    }
  }

  return (
    <header>
      <input
        type="checkbox"
        className={`${styles[`filterInput`]}`}
        id="searchSwitch"
      />
      {!isMobile && (
        <div className={`${styles['XX']} ${styles.desktop}`}>
          {/* header 左側 */}
          <div className={styles['wrap-left']}>
            <div
              className={`${styles['shop-menu']} ${
                isShopList ? styles['open'] : ''
              }`}
            >
              <Button
                title="商品頁面"
                onClick={() => setIsShopList(!isShopList)}
                className={styles.shopButton}
              >
                線上商店
              </Button>
              <div className={styles['dropdown-content']}>
                <LoadLink
                  href="/product"
                  title="前往商品頁面中"
                  msg="請稍後..."
                >
                  咖啡選購
                </LoadLink>
                <LoadLink href="/course" title="前往課程頁面中" msg="請稍後...">
                  咖啡人的必修課
                </LoadLink>
              </div>
            </div>
            <LoadLink href="/article" title="正在進入咖啡專欄">
              咖啡專欄
            </LoadLink>
            <LoadLink href="/cafeMap" title="正在進入咖啡地圖">
              咖啡地圖
            </LoadLink>
          </div>

          {/* header 中間 */}
          <div className={`${styles['wrap-middle']} d-none d-md-block`}>
            <LoadLink href="/IGotBrew" title="跳轉中..." msg="請稍候...">
              <p className={styles.IGOTBREW}>Ｉ ＧＯＴ ＢＲＥＷ</p>
            </LoadLink>
          </div>

          {/* header 右側 */}
          <div className={styles['wrap-right']}>
            {/* 放大鏡 */}
            <div className="dropdown">
              <label
                htmlFor="searchSwitch"
                style={{ cursor: 'pointer' }}
                aria-label="搜尋切換" // (加個描述, 才不會有紅線)
              >
                <FaSearch />
              </label>
            </div>

            {/* 購物車 */}
            <div className="dropdown">
              <Link href="/cart" className={`${styles.dropdown1}`}>
                <FaShoppingCart
                  sx={{ fontSize: '1.6rem' }}
                  onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => setIsOpen(false)}
                />
                {totalItems > 0 && (
                  <span
                    className={styles['cart-count']}
                    style={{
                      position: 'absolute',
                      padding: '0px 4px',
                      borderRadius: '50%',
                      backgroundColor: '#EBA92B',
                      color: '#1b3947',
                      top: '-5px',
                      right: '-7px',
                    }}
                  >
                    {cartItems.length}
                  </span>
                )}

                {/* 購物車列表 */}
                {isOpen && (
                  <div
                    className={styles['dropdown1-content']}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                  >
                    <div className={`ps-3 py-3 ${styles.cartTitle}`}>
                      最近加入的商品
                    </div>
                    {totalItems <= 0 ? (
                      <div className="text-center py-3 fs-3">購物車為空</div>
                    ) : (
                      <>
                        {cartItems.map((e) => (
                          <div
                            key={e.id}
                            className={`d-flex gap-3 ${styles['dropdown-item']}`}
                          >
                            <div className={`${styles.cartImg}`}>
                              <Image
                                src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${e.img}`}
                                className="border w-100 h-100"
                                width={100}
                                height={100}
                                alt=""
                              />
                            </div>
                            <div>
                              <Link
                                className="text-decoration-none"
                                href={`/product/${e.id}`}
                              >
                                <div className={` ${styles.cartName}`}>
                                  {e.name}
                                </div>
                              </Link>
                              <div className={`ms-2 mt-2 ${styles.cartQty}`}>
                                X {e.quantity}
                              </div>
                            </div>
                            <div>${e.price}</div>
                          </div>
                        ))}
                      </>
                    )}
                    <div className={`d-flex justify-content-end`}>
                      <Link href={cartItems.length > 0 ? '/cart' : '/product'}>
                        <MuiButton
                          className="mt-2 me-3 mb-3"
                          variant="contained"
                          sx={{
                            borderColor: '#2B4f61',
                            color: 'white',
                            fontSize: '12px',
                            backgroundColor: '#2B4f61',
                            '&:hover': {
                              borderColor: '#e4960e',
                              backgroundColor: '#e4960e',
                              color: 'black',
                            },
                          }}
                        >
                          {cartItems.length > 0 ? '查看購物車' : '前往購物'}
                        </MuiButton>
                      </Link>
                    </div>
                  </div>
                )}
              </Link>
            </div>

            {/* 使用者頭像部份 */}
            <div className="dropdown d-none d-md-block">
              <a
                href="#"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {/* 使用者頭像 */}
                {auth?.userData?.img ? (
                  <Image
                    src={auth.userData.img}
                    className="rounded-circle"
                    alt="使用者頭像"
                    width={40}
                    height={40}
                  />
                ) : (
                  <FaUserCircle />
                )}
              </a>

              {/* 新增的部份 */}
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                {auth ? (
                  <li>
                    <LoadLink
                      href="/user"
                      title="正在進入會員中心"
                      className="dropdown-item"
                      style={{ fontSize: '1.2rem' }}
                    >
                      會員中心
                    </LoadLink>
                  </li>
                ) : null}

                {auth && auth.userData.permissions == 1 && (
                  <>
                    <li>
                      <Link href="/anal" legacyBehavior>
                        <a
                          className="dropdown-item"
                          style={{ fontSize: '1.2rem' }}
                        >
                          後台管理
                        </a>
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  {auth.isAuth ? (
                    <button
                      className="dropdown-item"
                      onClick={Logout_btn}
                      style={{
                        fontSize: '1.4rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      登出
                    </button>
                  ) : (
                    <Link
                      className="dropdown-item"
                      href="/login"
                      style={{ fontSize: '1.4rem' }}
                    >
                      登入
                    </Link>
                  )}
                </li>
              </ul>
            </div>

            {/* 三明治按鈕 */}
            <div className="dropdown d-md-none">
              <a
                href="#"
                onClick={(e) => {
                  List_switch(e)
                }}
              >
                <div
                  style={{
                    transition: 'all 0.5s ease',
                    transform: animationToggle
                      ? 'rotate(90deg) scale(1.2)'
                      : 'rotate(0deg) scale(1)',
                    opacity: animationToggle ? 1 : 1,
                  }}
                >
                  {animationToggle ? <FaXmark /> : <FaBars />}
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 放大鏡 + 搜尋系統 */}
      <SiteWide_search />

      {/* 手機板列表 animationToggle要改*/}
      <div
        className={`${styles.phone} ${animationClass} ${
          animationToggle ? 'd-block' : 'd-none'
        } p-0 `}
        // 雨妏的旋轉咖啡有到10層
        style={{ position: 'relative', zIndex: 300 }}
      >
        <Phone_menu List_switch={List_switch} />
      </div>
      {/* 加載畫面 */}
      {loading && (
        <div style={{ width: '150px' }}>
          <Loading />
        </div>
      )}
    </header>
  )
}
