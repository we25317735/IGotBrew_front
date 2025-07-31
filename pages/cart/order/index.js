import { useState, useEffect, useContext } from 'react'
import { useAuth } from '@/hooks/use-auth'
import Cards from 'react-credit-cards-2'
import styles from '@/styles/order.module.scss'
import Image from 'next/image'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import sevenIcon from '@/public/images/cart/711icon.svg'
import { FaArrowLeft } from 'react-icons/fa6'
import { RiCoupon2Line } from 'react-icons/ri'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { TextField, Button, FormControlLabel } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCart } from '@/hooks/use-cart'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import Swal from 'sweetalert2'
import linepayicon from '@/public/images/cart/LINE-Pay(h)_W85_n.png'
import { countries, townships, postcodes } from '@/utils/tw-township'
import { useShip711StoreOpener } from '@/hooks/use-ship-711-store'
import Link from 'next/link'
import { sanitizeObject } from '@/utils/safety'
import Loading from '@/components/Loading'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import Cart_header from '../components/cart_header' // 購買步驟組件

// .env 檔案載入(共用api部分)
import 'dotenv/config.js'

let freight = 60

export default function Order() {
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入 loading
  const [deliveryMethod, setDeliveryMethod] = useState('') // 運送方式選擇
  const [paymentMethod, setPaymentMethod] = useState('') // 付款方式選擇
  const [isCheckedCard, setIsCheckedCard] = useState(false) // 一件輸入信用卡資料(先保留)
  const [selectedCity, setSelectedCity] = useState(countries[0]) // 宅配到府: 縣(陣列為縣代號)
  const [selectedArea, setSelectedArea] = useState(
    townships[countries.indexOf(selectedCity)][0]
  ) // 宅配到府: 市

  const [isChecked, setIsChecked] = useState(false) // 收件人資訊, 有無套用會員資料
  const [isCheckedAdd, setIsCheckedAdd] = useState(false) // 運送方式, 套會員資料 radio
  const [shippingAddress, setShippingAddress] = useState('') // 宅配到府: 地址 (要修)
  const [invoiceMethod, setInvoiceMethod] = useState('') // 發票處理

  const [hasProducts, setHasProducts] = useState('') // 購買的商品
  const [hasCourses, setHasCourses] = useState('') // 購買的課程

  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分
  const { cartCheckout } = useCart()
  const router = useRouter()

  // 7-11 超商取貨 API
  const { store711, openWindow, closeWindow } = useShip711StoreOpener(
    `${process.env.NEXT_PUBLIC_BACK_API}/shipment/711`,
    { autoCloseMins: 3 }
  )

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth, router])

  // 接收購物車紀載的訊息
  useEffect(() => {
    /* 商品課程過濾 */
    const hasProducts = cartCheckout.cart.filter(
      (v) => v.classification === 'product'
    )
    const hasCourses = cartCheckout.cart.filter(
      (v) => v.classification === 'course'
    )

    /* 以下 2 個是為了渲染 */
    setHasProducts(hasProducts)
    setHasCourses(hasCourses)

    // 實際傳送 API 時不需分類
    setFormData((prev) => ({
      ...prev,
      cartItems: cartCheckout.cart,
    }))
  }, [cartCheckout])

  useEffect(() => {
    // router.push('/IGotBrew') // 如果沒有按下按鈕，重定向到首頁
  }, [router])

  // 7-11 超商取貨訊息取得
  useEffect(() => {
    if (store711.storeid && store711.storename) {
      setFormData((prev) => ({
        ...prev,
        store_id: store711.storeid,
        store_name: store711.storename,
      }))
    }
  }, [store711])

  // 表單全部資料
  const [formData, setFormData] = useState({
    /* 1. 收件人資訊 */
    name: '',
    phone: '',
    email: '',

    /* 2. 運送方式 */
    ship_method: '',
    address: '', // 地址(拼合起來的)
    post: '', // 郵遞區號

    store_name: '', // 門市名稱
    store_id: '', // 門市號碼

    /* 3. 付款方式 */
    pay_method: '',

    // (那張信用卡)
    expiry: '', // 信用卡最後日期
    cvc: '', // 安全碼
    cardnum: '', // 信用卡號
    cardname: '', // 卡片使用人
    issuer: '', // (卡片特效)
    focused: '', // (卡片特效)
    formData: null, // (卡片特效)

    /* 4. 發票處理 */
    bill_type: '',
    foundation: '', // 發票捐贈處

    /* 最後: 使用者和購物車內容 */
    user_id: '',
    total_amount: '',
    coupon_id: '',
    cartItems: [],
  })

  // 畫面需要 roload 時跳出
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = '' // 某些瀏覽器需要這行才會顯示提示
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // 信用卡一鍵輸入(先留者)
  const doAutoFill = () => {
    setIsCheckedCard(!isCheckedCard)
    if (!isCheckedCard) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        expiry: '08/28',
        cvc: '565',
        cardnum: '5553445677321416',
        cardname: '張靈甫',
      }))
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        expiry: '',
        cvc: '',
        cardnum: '',
        cardname: '',
      }))
    }
  }

  // 要修一下, 宅配到府部分(選擇的縣市, 帶入 input)
  useEffect(() => {
    if (selectedCity && selectedArea) {
      const newAddress = `${selectedCity}${selectedArea}`
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: newAddress,
      }))
      setShippingAddress(newAddress)
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: '',
      }))
      setShippingAddress('')
    }
  }, [selectedCity, selectedArea])

  // 資料輸入進 formData, 所有 input 適用( formData 統一資料流)
  const doInputChange = (e) => {
    let { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 會員資料, 一鍵輸入
  const doCheckboxChange = () => {
    setIsChecked(!isChecked)
    if (!isChecked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: auth.userData.name,
        phone: auth.userData.phone,
        email: auth.userData.email,
      }))
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: '',
        phone: '',
        email: '',
      }))
    }
  }

  // 運送方式: 同會員地址 radio (宅配)
  const userAddress = () => {
    if (!isCheckedAdd && deliveryMethod === '宅配到府') {
      setIsCheckedAdd(true) // checked 打勾

      /* 選擇同步: 帶入使用者地址訊息 */
      setSelectedCity(auth.userData.city)
      setSelectedArea(auth.userData.area)
    } else {
      setIsCheckedAdd(false) // checked 取消打勾

      /* 取消同步: 回到初始設定 */
      setSelectedCity(countries[0])
      setSelectedArea(townships[countries.indexOf(selectedCity)][0])
    }
  }

  // 結帳按鈕(這邊非常的土法煉鋼)
  const doSubmit = (e) => {
    /* 
      總之就是: 寫入用什麼方式, 然後把無關的訊息清空 
    */

    e.preventDefault() // 阻止預設刷新
    let newFormData = { ...formData } // 先複製舊的 formData(改完後再放進 formData, 規避非同步)

    // 運送方式
    if (deliveryMethod === '宅配到府') {
      newFormData = {
        ...newFormData,
        ship_method: '宅配到府',
        store_name: '',
        store_id: '',
      }
    } else if (deliveryMethod === '超商取貨') {
      newFormData = {
        ...newFormData,
        ship_method: '超商取貨',
        address: '',
        post: '',
      }
    }

    // 付款方式
    if (paymentMethod === '信用卡') {
      newFormData = {
        ...newFormData,
        pay_method: '信用卡',
      }
    } else if (paymentMethod === '電子支付') {
      newFormData = {
        ...newFormData,
        pay_method: '電子支付',

        expiry: '',
        cvc: '',
        cardnum: '',
        cardname: '',
        issuer: '',
        focused: '',
        formData: '',
      }
    }

    // 發票處理
    if (invoiceMethod === '紙本發票') {
      newFormData = {
        ...newFormData,
        bill_type: '紙本發票',
        foundation: '',
      }
    } else if (invoiceMethod === '發票捐贈') {
      newFormData = {
        ...newFormData,
        bill_type: '發票捐贈',
      }
    }

    /*
      運送方式: deliveryMethod(宅配到府, 貨到付款)
      付款方式: paymentMethod(信用卡, 電子支付)
      發票處理: invoiceMethod(紙本發票, 發票捐贈)
    */

    // 最後一次更新狀態
    setFormData(newFormData)

    // 因為 setFormData 是非同步，這裡 formData 還是舊的，所以用 newFormData 代替
    // console.log('結帳: ', newFormData)
    let data = sanitizeObject(newFormData) // 消毒
    // console.log('消毒後: ', data)

    sendOrder(data) // 已經不用渲染了, 直接拿 data 傳 API 即可
  }

  // 最後: 呼叫 API 並送出訂單
  const sendOrder = async (data) => {
    const postUrl = `${process.env.NEXT_PUBLIC_BACK_API}/cart/create` //建立訂單

    // console.log('傳 api: ', data)

    const res = await axios.post(postUrl, data) // 訂單儲存 SQL

    // 儲存成功後回傳
    if (res.data.status) {
      const transaction = res.data.transaction_id

      console.log('訂單建立成功')
      router.push(`/cart/orderComple?transaction_id=${transaction}`)
    }
  }

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
      <div className={`container-fluid ${styles['cart']}`}>
        <Header />

        <div className={`d-md-none d-block mb-4 ${styles['back-icon']}`}>
          <FaArrowLeft />
          <Link className=" text-decoration-none" href="/cart">
            <span className={`ms-2 ${styles.h4}`}>回上一頁</span>
          </Link>
        </div>

        {/* 購買步驟組件(選擇2號) */}
        <Cart_header active={2} />

        <form action="" method="post" onSubmit={doSubmit}>
          <div
            className={`row justify-content-center  mt-5 ${styles['cart-main']}`}
          >
            <div
              className={`col-lg-4 col-md-6 col-sm-8 col-12 border border-secondary bg-white ${styles['cart-left']}`}
            >
              <div className="container">
                <div
                  className={`text-center border-bottom border-secondary py-2 ${styles['h1']}`}
                >
                  訂購資訊
                </div>
                <div className="border-bottom border-secondary">
                  <div className="d-flex justify-content-between mt-3 mb-1">
                    <div className={`mt-2 mt-md-0 ${styles['h2']}`}>
                      收件人資訊
                    </div>
                    <div className={`${styles['h5']}`}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={doCheckboxChange}
                            sx={{
                              '& .MuiSvgIcon-root': { fontSize: 28 },
                              color: '#bdbdbd',
                              '&.Mui-checked': {
                                color: '#2B4f61',
                              },
                            }}
                          />
                        }
                        label="同會員"
                        sx={{
                          margin: 0,

                          '& .MuiFormControlLabel-label': {
                            fontSize: '16px',
                            marginLeft: -1,
                            '@media (max-width: 391px)': {
                              fontSize: '14px',
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <TextField
                        id="outlined-basic"
                        label="姓名"
                        name="name"
                        required
                        variant="outlined"
                        onChange={doInputChange}
                        value={formData.name}
                        placeholder="請輸入姓名"
                        InputProps={{
                          sx: {
                            fontSize: 14,
                            '@media (max-width: 391px)': {
                              fontSize: '12px',
                            },
                          },
                        }}
                        InputLabelProps={{
                          sx: {
                            fontSize: 14,
                            '@media (max-width: 391px)': {
                              fontSize: '12px',
                            },
                            '&.MuiInputLabel-shrink': {
                              fontSize: 16,
                              color: '#2B4f61',
                              '@media (max-width: 391px)': {
                                fontSize: '14px',
                              },
                            },
                          },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#2B4f61',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2B4f61',
                            },
                          },
                        }}
                        fullWidth
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        id="outlined-basic"
                        label="電話"
                        name="phone"
                        type="phone"
                        required
                        variant="outlined"
                        onChange={doInputChange}
                        value={formData.phone}
                        placeholder="請輸入電話號碼"
                        InputProps={{
                          sx: {
                            fontSize: 14,
                            '@media (max-width: 391px)': {
                              fontSize: '12px',
                            },
                          },
                        }}
                        InputLabelProps={{
                          sx: {
                            fontSize: 14,
                            '@media (max-width: 391px)': {
                              fontSize: '12px',
                            },
                            '&.MuiInputLabel-shrink': {
                              fontSize: 16,
                              color: '#2B4f61',
                              '@media (max-width: 391px)': {
                                fontSize: '14px',
                              },
                            },
                          },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#2B4f61',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2B4f61',
                            },
                          },
                        }}
                        fullWidth
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        id="outlined-basic"
                        label="電子信箱"
                        name="email"
                        type="email"
                        required
                        variant="outlined"
                        onChange={doInputChange}
                        value={formData.email}
                        placeholder="請輸入電子信箱"
                        InputProps={{
                          sx: {
                            fontSize: 14,
                            '@media (max-width: 391px)': {
                              fontSize: '12px',
                            },
                          },
                        }}
                        InputLabelProps={{
                          sx: {
                            fontSize: 14,
                            '@media (max-width: 391px)': {
                              fontSize: '12px',
                            },
                            '&.MuiInputLabel-shrink': {
                              fontSize: 15,
                              color: '#2B4f61',
                              '@media (max-width: 391px)': {
                                fontSize: '12px',
                              },
                            },
                          },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#2B4f61',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2B4f61',
                            },
                          },
                        }}
                        fullWidth
                      />
                    </div>
                  </div>
                </div>

                {/* 運送方式 */}
                <div className="mt-3 border-bottom border-secondary">
                  <div className={`mb-3 ${styles['h2']}`}>運送方式</div>
                  <div
                    className={`d-flex justify-content-between gap-4 mb-4 ${styles['h5']}`}
                  >
                    <div className="d-flex gap-3">
                      <label className={`col-auto ${styles['radio-button']}`}>
                        <input
                          className="me-1 form-check-input"
                          name="deliverymethod"
                          type="radio"
                          required
                          value="1"
                          onClick={() => {
                            setDeliveryMethod('宅配到府') // 設定配送方式
                          }}
                        />
                        <i className="fa-solid fa-truck-fast me-1" />
                        宅配到府
                      </label>
                      <label className={`col-auto ${styles['radio-button']}`}>
                        <input
                          className="me-1 form-check-input"
                          name="deliverymethod"
                          type="radio"
                          value="2"
                          onClick={() => {
                            // setIsCheckedAdd(false) // 取消地址勾選
                            setDeliveryMethod('超商取貨')
                          }}
                        />
                        <i className="fa-solid fa-shop me-1" />
                        超商取貨
                      </label>
                    </div>
                    <div>
                      {/* 同會員住址按鈕 */}
                      {deliveryMethod === '宅配到府' && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isCheckedAdd}
                              onChange={userAddress}
                              sx={{
                                '& .MuiSvgIcon-root': { fontSize: 28 },
                                color: '#bdbdbd',
                                '&.Mui-checked': {
                                  color: '#2B4f61',
                                },
                              }}
                            />
                          }
                          label="同會員地址"
                          sx={{
                            margin: 0,

                            '& .MuiFormControlLabel-label': {
                              fontSize: '16px',
                              marginLeft: -1,
                              '@media (max-width: 391px)': {
                                fontSize: '14px',
                              },
                            },
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    {/* 宅配到府 */}
                    {deliveryMethod === '宅配到府' && (
                      <div className="row g-0 gap-3">
                        <div className="col-auto g-0 mt-2 mb-2">
                          <FormControl sx={{ m: 0, minWidth: 80 }} size="small">
                            <InputLabel
                              id="demo-simple-select-autowidth-label"
                              shrink={true}
                              required
                              sx={{
                                '&.MuiInputLabel-shrink': {
                                  fontSize: 15,
                                  color: '#2B4f61',
                                },
                              }}
                            >
                              縣市
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-autowidth-label"
                              id="demo-simple-select-autowidth"
                              label="Age"
                              onChange={(e) => setSelectedCity(e.target.value)}
                              value={selectedCity}
                              sx={{
                                fontSize: 14,
                                '@media (max-width: 391px)': {
                                  fontSize: '12px',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#c4c4c4',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#2B4f61',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                  {
                                    borderColor: '#2B4f61',
                                  },
                              }}
                            >
                              {countries.map((city) => (
                                <MenuItem
                                  key={city}
                                  value={city}
                                  sx={{
                                    fontSize: 14,
                                    '@media (max-width: 391px)': {
                                      fontSize: '12px',
                                    },
                                  }}
                                >
                                  {city}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                        <div className="col-auto mt-2 mb-2 d-block">
                          <FormControl sx={{ m: 0, minWidth: 80 }} size="small">
                            <InputLabel
                              id="demo-simple-select-autowidth-label"
                              shrink={true}
                              required
                              sx={{
                                '&.MuiInputLabel-shrink': {
                                  fontSize: 13,
                                  color: '#2B4f61',
                                  '@media (max-width: 391px)': {
                                    fontSize: '12px',
                                  },
                                },
                              }}
                            >
                              地區
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-autowidth-label"
                              id="demo-simple-select-autowidth"
                              label="Age"
                              onChange={(e) => setSelectedArea(e.target.value)}
                              value={selectedArea}
                              sx={{
                                fontSize: 14,
                                '@media (max-width: 391px)': {
                                  fontSize: '12px',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#c4c4c4',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#2B4f61',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                  {
                                    borderColor: '#2B4f61',
                                  },
                              }}
                            >
                              {townships[countries.indexOf(selectedCity)].map(
                                (area) => (
                                  <MenuItem
                                    key={area}
                                    value={area}
                                    sx={{ fontSize: 14 }}
                                  >
                                    {area}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </div>
                        <div className="col-2 mt-2 mb-2 d-block">
                          <FormControl
                            sx={{
                              m: 0,
                              minWidth: 80,
                              height: '40px',
                              '@media (max-width: 391px)': {
                                height: '36px',
                              },
                            }}
                            size="small"
                          >
                            <TextField
                              id="outlined-basic"
                              label="郵遞區號"
                              name="phone"
                              type="phone"
                              onChange={doInputChange}
                              variant="outlined"
                              // value={postcode}
                              InputProps={{
                                sx: {
                                  fontSize: 14,
                                  '@media (max-width: 391px)': {
                                    fontSize: '12px',
                                  },
                                  height: '100%',
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  fontSize: 14,
                                  '@media (max-width: 391px)': {
                                    fontSize: '12px',
                                  },

                                  '&.MuiInputLabel-shrink': {
                                    fontSize: 14,
                                    '@media (max-width: 391px)': {
                                      fontSize: '12px',
                                    },
                                    color: '#2B4f61',
                                  },
                                },
                              }}
                              FormHelperTextProps={{
                                sx: {
                                  fontSize: 14,
                                },
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2B4f61',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2B4f61',
                                  },
                                  height: '100%',
                                },
                                height: '40px',
                                '@media (max-width: 391px)': {
                                  height: '36px',
                                },
                              }}
                            />
                          </FormControl>
                        </div>
                        <div className=" mb-4">
                          <TextField
                            id="outlined-basic"
                            label="地址"
                            name="name"
                            required
                            variant="outlined"
                            // onChange={(e) => setAddress(e.target.value)}
                            value={formData.address}
                            placeholder="請輸入地址"
                            InputProps={{
                              sx: {
                                fontSize: 14,
                                '@media (max-width: 391px)': {
                                  fontSize: '12px',
                                },
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                fontSize: 14,
                                '@media (max-width: 391px)': {
                                  fontSize: '12px',
                                },

                                '&.MuiInputLabel-shrink': {
                                  fontSize: 16,
                                  '@media (max-width: 391px)': {
                                    fontSize: '14px',
                                  },
                                  color: '#2B4f61',
                                },
                              },
                            }}
                            FormHelperTextProps={{
                              sx: {
                                fontSize: 12,
                              },
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#2B4f61',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#2B4f61',
                                },
                              },
                            }}
                            fullWidth
                          />
                        </div>
                      </div>
                    )}

                    {/* 超商取貨 */}
                    {deliveryMethod === '超商取貨' && (
                      <div>
                        <div className="d-flex  mb-3">
                          <div className="mb-2">
                            <Image
                              src={sevenIcon}
                              alt=""
                              width={60}
                              height={60}
                            ></Image>
                          </div>
                          <div className="ms-3 mt-3 ">
                            <Button
                              variant="outlined"
                              onClick={() => {
                                openWindow()
                              }}
                              sx={{
                                borderColor: '#2B4f61',
                                color: '#2B4f61',
                                fontSize: '14px',

                                '&:hover': {
                                  borderColor: '#2B4f61',
                                  backgroundColor: '#2B4f61',
                                  color: 'white',
                                },
                                '@media (max-width: 391px)': {
                                  transform: 'scale(0.8)',
                                  transformOrigin: 'top left',
                                  textWrap: 'nowrap',
                                },
                              }}
                            >
                              {store711.storeid ? '重新選擇門市' : '選擇門市'}
                            </Button>

                            <br />
                          </div>
                          <div className={`${styles.seven}`}>
                            {store711.storeid && store711.storename && (
                              <div className={`ms-3 ${styles.h5}`}>
                                門市號碼 :
                                <input
                                  type="text"
                                  name="store_id"
                                  className="ms-md-2"
                                  // onChange={doChange}
                                  value={store711.storeid}
                                  disabled
                                />
                                <br />
                                門市名稱 :
                                <input
                                  type="text"
                                  name="store_name"
                                  className="mt-md-3 ms-md-2"
                                  // onChange={doChange}
                                  value={store711.storename}
                                  disabled
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 付款方式 */}
                <div className="mt-3 border-bottom border-secondary">
                  <div className={`mb-3 ${styles['h2']}`}>付款方式</div>
                  <div className={`d-flex gap-4 mb-4 ${styles['h5']}`}>
                    <label className={`col-auto ${styles['radio-button']}`}>
                      <input
                        className="me-1 form-check-input"
                        name="paytype"
                        type="radio"
                        value="1"
                        required
                        onClick={() => setPaymentMethod('信用卡')}
                      />
                      <i className="fa-brands fa-cc-visa me-1" />
                      信用卡支付
                    </label>
                    <label className={`col-auto ${styles['radio-button']}`}>
                      <input
                        className="me-1 form-check-input"
                        name="paytype"
                        type="radio"
                        value="2"
                        onClick={() => setPaymentMethod('電子支付')}
                      />
                      <i className="fa-brands fa-line me-1 text-success" />
                      電子支付
                    </label>

                    <button
                      className="ms-5 btn"
                      type="button"
                      onClick={doAutoFill}
                    >
                      一鍵輸入
                    </button>
                  </div>

                  {/* 信用卡支付: 那張信用卡 */}
                  {paymentMethod === '信用卡' && (
                    <div className="row">
                      <div className="col col-12 d-flex flex-column">
                        <div className="mt-2 mb-4">
                          <TextField
                            id="outlined-basic"
                            label="信用卡卡號"
                            required
                            name="cardnum"
                            variant="outlined"
                            value={formData.cardnum}
                            onChange={doInputChange}
                            // onFocus={}
                            pattern="[\d| ]{16,22}"
                            placeholder="請輸入卡號"
                            InputProps={{
                              sx: {
                                fontSize: 14,
                                '@media (max-width: 391px)': {
                                  fontSize: '12px',
                                },
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                fontSize: 14,
                                '@media (max-width: 391px)': {
                                  fontSize: '12px',
                                },

                                '&.MuiInputLabel-shrink': {
                                  fontSize: 15,
                                  '@media (max-width: 391px)': {
                                    fontSize: '13px',
                                  },
                                  color: '#2B4f61',
                                },
                              },
                            }}
                            FormHelperTextProps={{
                              sx: {
                                fontSize: 12,
                              },
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#2B4f61',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#2B4f61',
                                },
                              },
                            }}
                            fullWidth
                          />
                        </div>
                        <div className="mb-4">
                          <TextField
                            id="outlined-basic"
                            label="持卡人姓名"
                            name="cardname"
                            required
                            value={formData.cardname}
                            variant="outlined"
                            onChange={doInputChange}
                            // onFocus={}
                            placeholder="請輸入持卡人姓名"
                            InputProps={{
                              sx: {
                                fontSize: 14,
                                '@media (max-width: 391px)': {
                                  fontSize: '12px',
                                },
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                fontSize: 14,
                                '@media (max-width: 391px)': {
                                  fontSize: '12px',
                                },

                                '&.MuiInputLabel-shrink': {
                                  fontSize: 15,
                                  '@media (max-width: 391px)': {
                                    fontSize: '13px',
                                  },
                                  color: '#2B4f61',
                                },
                              },
                            }}
                            FormHelperTextProps={{
                              sx: {
                                fontSize: 12,
                              },
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#2B4f61',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#2B4f61',
                                },
                              },
                            }}
                            fullWidth
                          />
                        </div>
                        <div className="d-flex gap-4 mb-4 row">
                          <div className="form-floating col">
                            <TextField
                              id="outlined-basic"
                              label="有效日期"
                              required
                              name="expiry"
                              value={formData.expiry}
                              variant="outlined"
                              fullWidth
                              onChange={doInputChange}
                              // onFocus={}
                              placeholder="請輸入有效日期"
                              pattern="\d\d/\d\d"
                              InputProps={{
                                sx: {
                                  fontSize: 14,
                                  '@media (max-width: 391px)': {
                                    fontSize: '12px',
                                  },
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  fontSize: 14,
                                  '@media (max-width: 391px)': {
                                    fontSize: '12px',
                                  },

                                  '&.MuiInputLabel-shrink': {
                                    fontSize: 15,
                                    '@media (max-width: 391px)': {
                                      fontSize: '13px',
                                    },
                                    color: '#2B4f61',
                                  },
                                },
                              }}
                              FormHelperTextProps={{
                                sx: {
                                  fontSize: 12,
                                },
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2B4f61',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2B4f61',
                                  },
                                },
                              }}
                            />
                          </div>
                          <div className="form-floating col">
                            <TextField
                              id="outlined-basic"
                              label="安全碼"
                              required
                              name="cvc"
                              value={formData.cvc}
                              variant="outlined"
                              fullWidth
                              onChange={doInputChange}
                              // onFocus={}
                              placeholder="請輸入安全碼"
                              pattern="\d{3,4}"
                              InputProps={{
                                sx: {
                                  fontSize: 14,
                                  '@media (max-width: 391px)': {
                                    fontSize: '12px',
                                  },
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  fontSize: 14,
                                  '@media (max-width: 391px)': {
                                    fontSize: '12px',
                                  },

                                  '&.MuiInputLabel-shrink': {
                                    fontSize: 15,
                                    '@media (max-width: 391px)': {
                                      fontSize: '13px',
                                    },
                                    color: '#2B4f61',
                                  },
                                },
                              }}
                              FormHelperTextProps={{
                                sx: {
                                  fontSize: 12,
                                },
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2B4f61',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2B4f61',
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={`mb-4 d-md-flex d-none`}>
                        <Cards
                          number={formData.cardnum}
                          expiry={formData.expiry}
                          cvc={formData.cvc}
                          name={formData.cardname}
                          focused={formData.focus}
                        />
                      </div>
                    </div>
                  )}

                  {/* 電子支付: 目前為 LINE PAY 部分 */}
                  {paymentMethod === '電子支付' && (
                    <div className="mb-3">
                      <Image src={linepayicon} alt=""></Image>
                    </div>
                  )}
                </div>

                <div className="mt-3 border-bottom border-secondary">
                  <div className={`mb-3 ${styles['h2']}`}>發票資訊</div>
                  <div className={`d-flex gap-4 mb-4 ${styles['h5']}`}>
                    <label className={`col-auto ${styles['radio-button']}`}>
                      <input
                        required
                        className="me-1 form-check-input"
                        name="invoice"
                        type="radio"
                        value="1"
                        onClick={() => setInvoiceMethod('紙本發票')}
                      />
                      紙本發票
                    </label>
                    <label className={`col-auto ${styles['radio-button']}`}>
                      <input
                        className="me-1 form-check-input"
                        name="invoice"
                        type="radio"
                        value="2"
                        onClick={() => setInvoiceMethod('發票捐贈')}
                      />
                      發票捐贈
                    </label>
                  </div>
                  {invoiceMethod === '紙本發票' && (
                    <div className="d-block">
                      <div className={`form-check mb-2 ${styles['h5']}`}>
                        <input
                          className="form-check-input"
                          id="foundation1"
                          name="foundation"
                          type="radio"
                          required
                          value={'第一社會福利基金會'}
                          onChange={doInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="foundation1"
                        >
                          第一社會福利基金會
                        </label>
                      </div>
                      <div className={`form-check mb-2 ${styles['h5']}`}>
                        <input
                          className="form-check-input"
                          id="foundation2"
                          name="foundation"
                          type="radio"
                          value={'台北市脊髓損傷社會福利基金會'}
                          onChange={doInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="foundation2"
                        >
                          台北市脊髓損傷社會福利基金會
                        </label>
                      </div>
                      <div className={`form-check mb-2 ${styles['h5']}`}>
                        <input
                          className="form-check-input"
                          id="foundation3"
                          name="foundation"
                          type="radio"
                          value={'財團法人董氏基金會'}
                          onChange={doInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="foundation3"
                        >
                          財團法人董氏基金會
                        </label>
                      </div>
                      <div className={`form-check mb-2 ${styles['h5']}`}>
                        <input
                          className="form-check-input"
                          id="foundation4"
                          name="foundation"
                          type="radio"
                          value={'陽光社會福利基金會'}
                          onChange={doInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="foundation4"
                        >
                          陽光社會福利基金會
                        </label>
                      </div>
                      <div className={`form-check mb-2 ${styles['h5']}`}>
                        <input
                          className="form-check-input"
                          id="foundation5"
                          name="foundation"
                          type="radio"
                          value={'創世基金會'}
                          onChange={doInputChange}
                        />
                        <label
                          className="mb-2 form-check-label"
                          htmlFor="foundation5"
                        >
                          創世基金會
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="my-3">
                    <FormControlLabel
                      control={
                        <Checkbox
                          required
                          sx={{
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            color: '#bdbdbd',
                            '&.Mui-checked': {
                              color: '#2B4f61',
                            },
                          }}
                        />
                      }
                      label="我同意接受服務條款及隱私權政策。"
                      sx={{
                        marginLeft: -1,
                        '& .MuiFormControlLabel-label': {
                          '@media (max-width: 391px)': {
                            fontSize: '14px',
                          },
                          fontSize: '16px',
                          marginLeft: -1,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`col-lg-3 col-md-5 col-sm-7 col-12 ${styles['cart-right']}`}
            >
              <div
                className={`px-2 py-1 text-center border-bottom border-secondary ${styles['h1']} ${styles['cart-right-title']}`}
              >
                訂單詳情
              </div>
              <div className="border-bottom border-secondary pb-4">
                {hasProducts && hasProducts.length > 0 && (
                  <div
                    className={`my-2 px-2 ${styles['h3']} ${styles['right-body-title']}`}
                  >
                    商品
                  </div>
                )}

                {hasProducts.map((v) => {
                  return (
                    <div
                      key={v.id}
                      className="d-flex gap-4 ms-3 mt-md-4 mt-3 mb-4 mb-md-5 "
                    >
                      <div className={`col-2 ${styles['product-img']}`}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${v.img}`}
                          alt=""
                          width={500}
                          height={500}
                          className="w-100 h-100"
                        ></Image>
                      </div>
                      <div className="d-flex flex-column justify-content-evenly col-8 ">
                        <div
                          title={v.name}
                          className={`${styles['productTitle']} ${styles['h5']}`}
                        >
                          {v.name}
                        </div>
                        <div className="d-flex justify-content-between mt-md-3 mt-2">
                          <div className={`${styles['h4']}`}>${v.price}</div>
                          <div className={`${styles['h4']}`}>x{v.qty}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {hasCourses && hasCourses.length > 0 && (
                  <div
                    className={`my-2 px-2 ${styles['h3']} ${styles['right-body-title']}`}
                  >
                    課程
                  </div>
                )}
                {hasCourses.map((v) => {
                  return (
                    <div
                      key={v.id}
                      className="d-flex gap-4 ms-3 mt-md-4 mt-3 mb-4 mb-md-5 "
                    >
                      <div className={`col-2 ${styles['product-img']}`}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/${v.img}`}
                          width={10}
                          height={10}
                          alt=""
                          className="w-100 h-100"
                        ></Image>
                      </div>
                      <div className="d-flex flex-column justify-content-evenly col-8">
                        <div
                          title={v.name}
                          className={`${styles['h5']} ${styles['title']}`}
                        >
                          {v.name}
                        </div>
                        <div
                          className={`mt-md-3 mt-2 ${styles['h6']} ${styles['course-color']}`}
                        >
                          時間: {v.schedule}
                          <br />
                          地點: {v.location}
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                          <div className={`${styles['h4']}`}>${v.price}</div>
                          <div className={`${styles['h4']}`}>X{v.qty}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-md-3 mt-4 px-md-0 px-3">
                <div className="mt-3 mb-3">
                  <div
                    className={`d-flex align-items-center ${styles['coupon']} ${styles['h4']}`}
                  >
                    <div className="ms-2 mt-2 ps-2 col-3">
                      <RiCoupon2Line className="mb-1" fontSize={30} />
                    </div>
                    <div className="flex-grow-1 mt-2">
                      {cartCheckout.chooseCoupon.name ? (
                        <>
                          <div className="fw-bold pt-1">
                            {cartCheckout.chooseCoupon.name}
                          </div>
                          <p className="text-secondary small ">
                            (
                            {Number(cartCheckout.chooseCoupon.value) < 1
                              ? ` ${Number(
                                  cartCheckout.chooseCoupon.value * 10
                                ).toFixed(0)}折優惠`
                              : `折扣: ${cartCheckout.chooseCoupon.value}元`}
                            )
                          </p>
                        </>
                      ) : (
                        <div>未選取優惠券</div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`mt-2 d-flex justify-content-between ${styles['h3']}`}
                >
                  總金額
                  <span>{cartCheckout.totalPrice}</span>
                </div>

                {cartCheckout.chooseCoupon.name ? (
                  <div
                    className={`d-flex justify-content-between mt-1 ${styles['h3']}`}
                  >
                    優惠券折扣
                    <span>
                      {' '}
                      {Number(cartCheckout.chooseCoupon.value) < 1
                        ? ` ${Number(
                            cartCheckout.chooseCoupon.value * 10
                          ).toFixed(0)}折優惠`
                        : `折扣: ${cartCheckout.chooseCoupon.value}元`}
                    </span>
                  </div>
                ) : (
                  ''
                )}

                <div
                  className={`d-flex justify-content-between mt-1 ${styles['h3']}`}
                >
                  運費
                  <span />${freight}
                </div>
                <div
                  className={`d-flex justify-content-between mt-1 ${styles['h2']}`}
                >
                  <div>
                    實付金額
                    <span className={`ms-2 ${styles['h5']}`}>
                      (共{cartCheckout.cart.length}件商品)
                    </span>
                  </div>
                  <span className={`${styles.total}`}>
                    ${cartCheckout.allPrice}
                  </span>
                </div>
              </div>
              <div className="d-md-flex d-none justify-content-center gap-5 mt-5">
                <Link href="/cart">
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#2B4f61',
                      color: '#2B4f61',
                      fontSize: '18px',
                      '&:hover': {
                        borderColor: '#2B4f61',
                        backgroundColor: '#2B4f61',
                        color: 'white',
                      },
                    }}
                  >
                    上一頁
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    borderColor: '#2B4f61',
                    color: 'white',
                    fontSize: '18px',
                    backgroundColor: '#2B4f61',
                    '&:hover': {
                      borderColor: '#e4960e',
                      backgroundColor: '#e4960e',
                      color: 'black',
                    },
                  }}
                >
                  結帳
                </Button>
              </div>
              <div className="d-md-none d-flex justify-content-center mt-4">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    borderColor: '#2B4f61',
                    color: 'white',
                    fontSize: '18px',
                    backgroundColor: '#2B4f61',
                    '@media (max-width: 391px)': {
                      transform: 'scale(0.8)',
                      transformOrigin: 'top left',
                    },
                    '&:hover': {
                      borderColor: '#e4960e',
                      backgroundColor: '#e4960e',
                      color: 'black',
                    },
                  }}
                >
                  結帳
                </Button>
              </div>
            </div>
          </div>
        </form>
        <Footer />
      </div>
    </>
  )
}
