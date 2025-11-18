'use client'
import React, { useState, useContext, useEffect } from 'react'
import styles from './asset/style/nini.module.scss' // 使用 SCSS 模組
import Phone_menu from './components/Phone_menu/index' // 使用 SCSS 模組
import { FaShoppingCart, FaBars, FaSearch } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { FaUserCircle } from 'react-icons/fa'
import Image from 'next/image'
import { Button } from 'react-bootstrap'
import { Button as MuiButton } from '@mui/material'
import { logout, lineLogout } from '@/services/user'

import useFirebase from '@/hooks/use-firebase' // google 登出
import Loading from '../Loading' // loading 畫面
import SiteWide_search from './components/SiteWide_search' // loading 畫面

// 會員資料(這邊會調取空的 initUserData 用於重置狀態)
import { initUserData } from '@/hooks/use-auth'
import toast, { Toaster } from 'react-hot-toast' // 吐司
import 'dotenv/config.js' // .env 檔案載入(共用api部分)

// app 路由的 Header (pages 路由不通用)
export default function Header_redesign() {
  const { cartItems, totalQty, cart_Add } = useCart()
  const [isMobile, setIsMobile] = useState(false)
  const [animationClass, setAnimationClass] = useState('') // 動畫效果
  const [animationToggle, setAnimationToggle] = useState(false) // 動畫效果開關(失敗維修中...)
  const [data, setData] = useState([])
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false)
  const [cart, setCart] = useState([]) // 購物車內容渲染
  const [isOpen, setIsOpen] = useState(false) // 購物車 hover 開關

  const [loading, setLoading] = useState(false) // 點擊直到切換的過渡

  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分
  const { logoutFirebase } = useFirebase() // google 登出

  const router = useRouter() // 初始化router

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth])

  // 購物車更新
  useEffect(() => {
    let cart_array = [] // 預先製作陣列

    // 先處理商品
    const productItems = cartItems.filter(
      (item) => item.classification === 'product'
    )

    // 再處理課程
    const courseItems = cartItems.filter(
      (item) => item.classification === 'course'
    )

    // 合併排序後的陣列(先渲染完商品後, 在顯示課程)
    cart_array = [...productItems, ...courseItems]

    // 更新購物車內容
    setCart(cart_array)
  }, [cartItems])

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

  useEffect(() => {
    const handleResize = () => {
      // setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 登出測試
  const Logout_btn = async () => {
    logoutFirebase() // 1. 執行 Firebase 系列的登出

    const res = await logout()

    if (res.data.status === 'success') {
      toast.success('已成功登出')

      // 4. 重置會員認證狀態
      setAuth({
        isAuth: false,
        userData: initUserData,
      })

      // 5. 跳轉至登入頁面
      router.push('/login')
    } else {
      toast.error('Google 登出失敗')
    }
  }

  return (
    <header>
      <input
        type="checkbox"
        className={`${styles[`filterInput`]} opacity-0`}
        id="searchSwitch"
      />
      {!isMobile && (
        <div className={`${styles['XX']} ${styles.desktop}`}>
          {/* header 左側 */}
          <div className={styles['wrap-left']}>
            <div
              className={`${styles['shop-menu']} ${
                isShopMenuOpen ? styles['open'] : ''
              }`}
            >
              <Button
                title="商品頁面"
                onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
                className={styles.shopButton}
              >
                線上商店
              </Button>
              <div className={styles['dropdown-content']}>
                <Link href="/product">咖啡選購</Link>
                {/* <Link href="/course">咖啡人的必修課</Link> */}
              </div>
            </div>
            {/* <Link href="/article" title="咖啡專欄">
              咖啡專欄
            </Link>
            <Link href="/cafeMap" title="咖啡地圖">
              咖啡地圖
            </Link> */}
          </div>

          {/* header 中間 */}
          <div className={`${styles['wrap-middle']} d-none d-md-block`}>
            <Link href="/IGotBrew">
              <p className={styles.IGOTBREW}>Ｉ ＧＯＴ ＢＲＥＷ</p>
            </Link>
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
                {totalQty > 0 && (
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
                    {totalQty}
                  </span>
                )}

                {isOpen && (
                  <div
                    className={styles['dropdown1-content']}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                  >
                    <div className={`ps-3 py-3 ${styles.cartTitle}`}>
                      最近加入的商品
                    </div>
                    {totalQty <= 0 ? (
                      <div className="text-center py-3 fs-3">購物車為空</div>
                    ) : (
                      <>
                        {cart.map((e) => (
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
                                X{e.qty}
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
                    <Link href="/user" legacyBehavior>
                      <a
                        className="dropdown-item"
                        style={{ fontSize: '1.2rem' }}
                      >
                        會員中心
                      </a>
                    </Link>
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
