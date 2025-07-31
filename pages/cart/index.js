import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import styles from '@/styles/cart.module.scss'

import { useCart } from '@/hooks/use-cart'
import { Modal } from 'react-bootstrap'
import { AuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { Button } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Loading from '@/components/Loading'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import couponImg from '@/public/images/cart/couponimg.png'
import couponImg2 from '@/public/images/cart/couponImgyellow.png'
import Image from 'next/image'
import { RiCoupon2Line } from 'react-icons/ri'
import { useAuth } from '@/hooks/use-auth'
import { Gift } from 'lucide-react'

import Cart_header from './components/cart_header' // 購買步驟組件
import HotProduct from '@/pages/cart/components/hotproduct/hotproduct'
import CartList from '@/pages/cart/components/cartlist/productcartlist/productcartlist'
import CartList2 from '@/pages/cart/components/cartlist/coursecartlist/coursecartlist'

// .env 檔案載入(共用api部分)
import 'dotenv/config.js'

export default function Cart() {
  const {
    cart,
    cartItems,
    totalItems,
    totalPrice, // 總金額
    addItem,
    removeItem,
    updateItemQty,
    clearCart,
    isInCart,
    setCartCheckout, // 儲存結帳時狀態
  } = useCart()
  const [couponData, setCouponData] = useState([]) // 使用者優惠券
  const [discountAmount, setDiscountAmount] = useState() // 優惠券則扣
  const [CouponIndex, setCouponIndex] = useState([]) // 選擇優惠券 index
  const [exerciseCoupon, setExerciseCoupon] = useState([]) // 選擇要使用的優惠券
  const [freight, setFreight] = useState(60) // 運費(目前預設 60)
  const [allPrice, setAllPrice] = useState(totalPrice) // 計算總金額
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入設定
  const [selectedCoupon, setSelectedCoupon] = useState('')
  const [show, setShow] = useState(false) // RadioGroup(選擇優惠券) 開關
  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分
  const { setIsAllowed } = useContext(AuthContext) // 好像不重要
  const router = useRouter()

  // 新版商品課程過濾
  const hasProducts = cartItems.filter((v) => v.classification === 'product')
  const hasCourses = cartItems.filter((v) => v.classification === 'course')

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth])

  // 初始載入 loading
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])

  // 購物車或優惠券改變, 總金額也要改變
  useEffect(() => {
    if (exerciseCoupon) {
      // 有優惠券的話, 帶入折扣計算
      let allPrice = calculateDiscount(totalPrice, exerciseCoupon)
      setAllPrice(allPrice + freight) // 加運費
    } else {
      // 反之, 直接帶入總價格
      setAllPrice(totalPrice + freight) // 加運費
    }
  }, [totalPrice, exerciseCoupon])

  // 取得使用者優惠券
  useEffect(() => {
    const user = auth.userData

    const getCoupons = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACK_API}/user/${user.id}/coupon`
        )

        // console.log('所有優惠券: ', response.data.data)
        setCouponData(response.data.data) // 可能 SQL 語法後續要接 results(可能)
      } catch (error) {
        setCouponData([])
        console.error('獲取優惠券資料錯誤:', error)
      }
    }
    getCoupons()
  }, [auth, totalPrice])

  const doClose = () => {
    setShow(false)
  }

  const doShow = () => {
    setSelectedCoupon('')
    setShow(true)
  }

  // 下訂單按鈕
  const doCheckout = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '您的購物車為空',
        showConfirmButton: false,
        timer: 1000,
      })

      router.push('/product')
      return
    }

    if (!auth.isAuth) {
      Swal.fire({
        icon: 'warning',
        title: '請先登入',
        showConfirmButton: false,
        timer: 1000,
      })
      router.push('/login')
      return
    }

    // setIsAllowed(true)

    // 把購物訊息傳給 context, 給後續確認訂單使用
    let data = {
      cart: cartItems, // 結帳時購物車狀態
      chooseCoupon: exerciseCoupon, // 結帳時選擇的優惠券
      totalPrice: totalPrice, // 商品合計金額
      allPrice: allPrice, // 最終價格
    }
    setCartCheckout(data)

    router.push('/cart/order')
  }

  // 選擇使用的優惠券（只能選擇一張）
  const toggleCoupon = (coupon, index) => {
    if (CouponIndex[0] === index) {
      // 如果點到的是已選擇的，則取消選取
      setCouponIndex([])
      setExerciseCoupon([])
    } else {
      // 選擇新的優惠券，覆蓋原本的
      setCouponIndex([index])
      setExerciseCoupon(coupon)
    }
  }

  // 桌機板選擇優惠券(預計廢除)
  const doSelectChange = (event) => {
    const selectedCouponName = event.target.value
    const selectedCouponObj = couponData.find(
      (coupon) => coupon.coupon_name === selectedCouponName
    )

    if (selectedCouponObj) {
      const discount = calculateDiscount(totalPrice, selectedCouponObj)

      setAllPrice(discount)
    }
    setSelectedCoupon(selectedCouponName)
  }

  // 折扣計算函數
  const calculateDiscount = (price, coupon) => {
    let finalPrice = price

    if (coupon.type === 'amount') {
      finalPrice = price - parseFloat(coupon.value)
      setDiscountAmount(parseFloat(coupon.coupon_value))
    } else if (coupon.type === 'percent') {
      finalPrice = Math.round(price * coupon.value)
      const discountValue = price - finalPrice
      setDiscountAmount(discountValue)
    }

    return finalPrice
  }

  if (isInitialLoad) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <>
      <Modal show={show} onHide={doClose} centered size={'xl'}>
        <Modal.Header style={{ borderBottom: 'none' }} closeButton>
          <Modal.Title className={`${styles.h2}`}>選擇優惠券</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* 優惠券渲染 */}
          <div className={`${styles['coupons-list']} row gap-3 mx-auto`}>
            {couponData ? (
              couponData.map((coupon, index) => (
                <div
                  key={index}
                  className={` ${styles['coupon-item']} col-12 col-sm-6 col-md-4 d-flex  border rounded mb-3`}
                >
                  <div className="flex-grow-1">
                    <div className="d-flex">
                      <Gift
                        className={`${styles['coupon-icon']} `}
                        style={{ marginTop: '3px' }}
                      />

                      <h3
                        className={`${styles['coupon-title']} ms-2 text-nowrap`}
                      >
                        {coupon.name}
                        <span className="fs-6">
                          (
                          {Number(coupon.value) < 1
                            ? `打${Number(coupon.value * 10).toFixed(0)}折優惠`
                            : `折扣: ${coupon.value}元`}
                          )
                        </span>
                      </h3>
                    </div>

                    <p className={`${styles['coupon-code']}`}>
                      活動: {coupon.description}
                    </p>
                    <p className={`${styles['coupon-expiry']}`}>
                      有效期限: {coupon.end_time}
                    </p>
                  </div>

                  <div className="align-self-center">
                    <Button
                      variant="outlined"
                      // 用 couponData 的 index 來區別個案
                      onClick={() => toggleCoupon(coupon, index)}
                      sx={{
                        color: CouponIndex.includes(index)
                          ? 'white'
                          : '#2B4f61',
                        backgroundColor: CouponIndex.includes(index)
                          ? '#2B4f61'
                          : 'transparent',
                        fontSize: '16px',
                        textWrap: 'nowrap',
                        '&:hover': {
                          borderColor: '#2B4f61',
                          backgroundColor: '#2B4f61',
                          color: 'white',
                        },
                        '@media (max-width: 391px)': {
                          transform: 'scale(0.7)',
                          transformOrigin: 'top left',
                          textWrap: 'nowrap',
                        },
                      }}
                    >
                      {CouponIndex.includes(index) ? '使用' : '選擇'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div>目前沒有符合條件的優惠券</div>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {/* 組件這邊開始 */}
      <div className={`container-fluid g-0 ${styles['carts']}`}>
        {/* <Header /> */}

        {/* 購買步驟組件(選擇1號) */}
        <Cart_header active={1} />

        {/* 購物車內容 */}
        <div className={`row g-0 gap-5 ${styles['cart-main']}`}>
          <div className={`col-12 col-md-8 ${styles['main-left']}`}>
            {hasProducts.length > 0 && <CartList />}
            {hasCourses.length > 0 && <CartList2 />}
            {!hasProducts && !hasCourses && (
              <div className={`text-center py-5 ${styles.h2}`}>購物車為空</div>
            )}
          </div>

          {/* 訂單詳情 */}
          <div
            className={`ms-md-0 ms-2 col-md-4 col-12  ${styles['main-right']}`}
          >
            <div
              className={`container d-flex align-items-center ${styles['main-right-title']}`}
            >
              訂單詳情
            </div>
            <div className="ms-md-0 ms-2 ps-0 mt-3 mb-3">
              <div className={` d-flex align-items-center `}>
                {/* 手機板 */}
                <div className={`ms-2 col-auto d-md-flex d-none `}>
                  <div className={`d-flex me-3  my-auto ${styles.h4}`}>
                    <RiCoupon2Line fontSize={30} className=" mb-1" />：
                    <div className="mt-1 me-3">{selectedCoupon}</div>
                  </div>
                  <Button
                    variant="outlined"
                    onClick={doShow}
                    sx={{
                      borderColor: '#2B4f61',
                      color: '#2B4f61',
                      fontSize: '16px',

                      '&:hover': {
                        borderColor: '#2B4f61',
                        backgroundColor: '#2B4f61',
                        color: 'white',
                      },
                      '@media (max-width: 391px)': {
                        transform: 'scale(0.7)',
                        transformOrigin: 'top left',
                        textWrap: 'nowrap',
                      },
                    }}
                  >
                    {selectedCoupon.length != 0 ? '重新選擇' : '選擇優惠券'}
                  </Button>
                </div>
                {/* 桌機板 */}
                <div className="ms-2 col-auto d-md-none d-flex ">
                  <RiCoupon2Line fontSize={30} />
                  <select
                    className={`form-select ms-3 ${styles['h5']}`}
                    onChange={doSelectChange}
                    value={selectedCoupon}
                  >
                    <option value="">請選擇優惠券</option>
                    {couponData &&
                      couponData.map((e, index) => (
                        <option key={index} value={e.value}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div
              className={`pt-2 d-flex justify-content-between ${styles['main-right-body']}`}
            >
              <h3>總金額</h3>
              <h3>${totalPrice}</h3>
            </div>

            {exerciseCoupon.value !== undefined && (
              <div
                className={`pt-2 d-flex justify-content-between ${styles['main-right-body']}`}
              >
                <h3>優惠券折扣</h3>
                <h3>
                  {Number(exerciseCoupon.value) < 1
                    ? `打${Number(exerciseCoupon.value * 10).toFixed(0)}折優惠`
                    : `折扣: ${exerciseCoupon.value}元`}
                </h3>
              </div>
            )}

            {totalPrice > 0 && (
              <div
                className={`pt-2 d-flex justify-content-between ${styles['main-right-body']}`}
              >
                <h3>運費</h3>
                <h3>${freight}</h3>
              </div>
            )}
            <div
              className={`pt-2 d-flex justify-content-between ${styles['right-bottom-bottom']}`}
            >
              <h2>
                實付金額<span>(共{totalItems}件商品)</span>
              </h2>
              <p>${allPrice}</p>
            </div>

            <div className={`d-flex justify-content-center mt-4 ms-md-0 ms-3`}>
              <Button
                variant="contained"
                type="submit"
                onClick={doCheckout}
                sx={{
                  borderColor: '#2B4f61',
                  color: 'white',
                  fontSize: '18px',
                  borderRadius: '7px',
                  backgroundColor: '#2B4f61',
                  '@media (max-width: 391px)': {
                    transform: 'scale(0.9)',
                    transformOrigin: 'top left',
                  },
                  '&:hover': {
                    borderColor: '#e4960e',
                    backgroundColor: '#e4960e',
                    color: 'black',
                  },
                }}
              >
                下訂單
              </Button>
            </div>
          </div>
        </div>

        {/* 推薦商品部分 */}
        <div className={`${styles.hotproduct}`}>
          <HotProduct />
        </div>
        <div className="mt-md-0 mt-5">
          <Footer />
        </div>
      </div>
    </>
  )
}
