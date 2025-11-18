'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/product.module.scss'
import { LiaAngleRightSolid } from 'react-icons/lia'
import { FaBullhorn, FaTag, FaHeart, FaStar } from 'react-icons/fa'
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
  FaFire,
  FaUsers,
} from 'react-icons/fa6'
import {
  TbHexagonNumber1Filled,
  TbHexagonNumber2Filled,
  TbHexagonNumber3Filled,
} from 'react-icons/tb'
import Header from '@/components/Header_redesign'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'


// 取出當前使用者
import { useAuth } from '@/hooks/use-auth'

import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  TextField,
  Box,
  InputAdornment,
  OutlinedInput,
  Autocomplete,
  Button,
} from '@mui/material'

import 'dotenv/config.js' // .env 檔案載入(共用api部分)

/* 後續新增改動 */
// import hero_img from './assets/img/bg-top.png'
// import product_top from './assets/img/product-top.png'

// 商品頁 主要頁面
export default function ProductClient({
  findProduct,
  hotProducts,
  topRatedProducts,
  specialProducts,
  findTotalPages,
  findNewPages,
  query_type,
  find,
  sort,
}) {
  const [products, setProducts] = useState(findProduct) // 當前頁數(SSR 預設)
  const [currentPage, setCurrentPage] = useState(findNewPages) // 當前頁數(SSR 預設)
  const [totalPages, setTotalPages] = useState(findTotalPages) // 總頁數(SSR 預設)

  const [searchProduct, setSearchProduct] = useState(find) // 搜尋商品
  const [type, setType] = useState(query_type) // 搜尋類別大項(咖啡機或是咖啡豆選擇)
  const [categoryId, setCategoryId] = useState(``)
  const [categories, setCategories] = useState([]) // 渲染搜尋類別細項(咖啡機或是咖啡豆細項)

  const [sortBy, setSortBy] = useState(sort) // 排序方式

  const [totalProducts, setTotalProducts] = useState(findProduct.length) // 搜尋商品總量
  const [limitedTime, setLimitedTime] = useState(null) // 限時購買部分
  const [favorites, setFavorites] = useState({}) // 使用者商品關注
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入設定

  const router = useRouter()
  const searchParams = useSearchParams()

  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth])

  // 顯示關注的部分(在使用者完全載入後才執行)
  useEffect(() => {
    if (auth.isAuth) {
      fetchFavorites()
    }
  }, [auth.isAuth])

  // 接收 url 值
  useEffect(() => {
    const findQuery = searchParams.get('find')
    if (findQuery) {
      setSearchProduct(findQuery)
    }
  }, [searchParams])

  // 引響商品列表部分(關於列表的重新處理)
  useEffect(() => {
    getCategories() // 商品細項過濾

    if (!isInitialLoad) {
      getProduct()
    }
  }, [type, categoryId, currentPage, sortBy])

  // CSR URL 重新渲染
  const RouteRefresh = () => {
    const params = new URLSearchParams(searchParams)
    if (searchProduct) params.set('find', searchProduct)
    else params.delete('find')
    if (type) params.set('type', type)
    else params.delete('type')
    if (sortBy && sortBy !== 'default') params.set('sort', sortBy)
    else params.delete('sort')
    if (currentPage && currentPage !== 1)
      params.set('page', String(currentPage))
    else params.delete('page')

    router.push(`/product?${params.toString()}`, { scroll: false })
  }

  // 關鍵字搜尋
  //   const getfindProduct = async () => {
  //     let apiUrl = `${process.env.NEXT_PUBLIC_BACK_API}/product?find=${searchProduct}`

  //     const res = await fetch(apiUrl)
  //     const data = await res.json()
  //     if (data.status === `success`) {
  //       router.push(`/product?find=${searchProduct}`)
  //       setProducts(data.data.products)
  //       setTotalProducts(data.data.totalProducts)
  //       setCurrentPage(1) //頁數回到第一頁
  //     } else {
  //       console.error(`Failed to fetch products:`, data.message)
  //     }
  //   }

  // 重新取得商品列表( 商品列表 CSR 渲染 API )
  const getProduct = async () => {
    let apiUrl = `${process.env.NEXT_PUBLIC_BACK_API}/product?find=${searchProduct}&type=${type}&sort=${sortBy}&page=${currentPage}&category_id=${categoryId}`

    const res = await fetch(apiUrl)
    const data = await res.json()
    if (data.status === `success`) {
      setProducts(data.data.products)
      setTotalPages(data.data.totalPages)
      setTotalProducts(data.data.totalProducts)

      RouteRefresh() // 變更 url(有搜尋商品時顯示商品)
    } else {
      console.error(`Failed to fetch products:`, data.message)
    }
  }

  // 頁數部分(商品下方選擇頁數的部分)
  const renderPagination = () => {
    const pageNumbers = []
    const maxPages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
    let endPage = Math.min(totalPages, startPage + maxPages - 1)

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers.map((page) => (
      <a
        key={page}
        onClick={(event) => {
          handlePageChange(page)
          event.preventDefault()
        }}
        className={currentPage === page ? styles.selected : ``}
        href="#"
      >
        {page}
      </a>
    ))
  }

  // 顯示按讚的部分
  const fetchFavorites = async () => {
    if (!auth.isAuth) return
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_API}/product/favorites/${auth.userData.id}`
      )
      const data = await response.json()
      if (data.status === `success`) {
        const favMap = {}
        data.favorites.forEach((fav) => {
          favMap[fav.product_id] = true
        })
        setFavorites(favMap)
      }
    } catch (error) {
      console.error(`Error fetching favorites:`, error)
    }
  }

  // 新增移除關注
  const toggleFavorite = async (productId) => {
    if (!auth.isAuth) {
      alert(`請先登入`)
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_API}/product/favorite`,
        {
          method: `POST`,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: auth.userData.id,
            product_id: productId,
          }),
        }
      )

      const data = await response.json()
      if (data.status === `success`) {
        setFavorites((prev) => ({
          ...prev,
          [productId]: !prev[productId],
        }))
      }
    } catch (error) {
      console.error(`Error toggling favorite:`, error)
    }
  }

  // 回傳商品細項 API
  const getCategories = async () => {
    if (!type) {
      setCategories([])
      return
    }
    let apiUrl = `${process.env.NEXT_PUBLIC_BACK_API}/product/categories?type=${type}`

    try {
      const res = await fetch(apiUrl)
      const data = await res.json()
      if (data.status === `success`) {
        setCategories(data.data.categories)
      } else {
        console.error(`Failed to fetch categories:`, data.message)
        setCategories([])
      }
    } catch (error) {
      console.error(`Error fetching categories:`, error)
      setCategories([])
    }
  }

  // 取得限時特賣時間
  useEffect(() => {
    const fetchLimitedTime = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_API}/product/limited-time`
        )
        const data = await response.json()
        if (data.status === `success`) {
          setLimitedTime(new Date(data.data.limitedTime))
        }
      } catch (error) {
        console.error(`Error fetching limited time:`, error)
      }
    }

    fetchLimitedTime()
  }, [])

  // 限時特賣計時(限時特賣時間渲染)
  useEffect(() => {
    if (limitedTime) {
      const timer = setInterval(() => {
        const now = new Date()
        const difference = limitedTime.getTime() - now.getTime()

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          )
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          )
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          const daysElement = document.getElementById(`days`)
          const hoursElement = document.getElementById(`hours`)
          const minutesElement = document.getElementById(`minutes`)
          const secondsElement = document.getElementById(`seconds`)

          if (daysElement) {
            daysElement.textContent = days.toString().padStart(2, `0`)
          }
          if (hoursElement) {
            hoursElement.textContent = hours.toString().padStart(2, `0`)
          }
          if (minutesElement) {
            minutesElement.textContent = minutes.toString().padStart(2, `0`)
          }
          if (secondsElement) {
            secondsElement.textContent = seconds.toString().padStart(2, `0`)
          }
        } else {
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [limitedTime])

  // 換頁部分, 當前頁籤 active
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }

    if (page !== 1) {
      const productTop = document.querySelector(`.${styles[`product-top`]}`)
      if (productTop) {
        productTop.scrollIntoView({ behavior: `smooth` })
      }
    }
  }

  // 初始載入 loading
  useEffect(() => {
    setIsInitialLoad(false)
  }, [])

  if (isInitialLoad) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <>
      <div className={`container-fluid ${styles.backg} mt-3`}>
        <Header />
        <div className={`container ${styles[`one`]} mt-5`}>
          <div className={`${styles[`bread`]}`}>
            <div className={`${styles[`innerBread`]}`}>
              <Link href="/IGotBrew">首頁</Link>
              <LiaAngleRightSolid />
            </div>
            <div className={`${styles[`innerBread`]}`}>
              <Link href="/IGotBrew">線上商店</Link>
              <LiaAngleRightSolid />
            </div>
            <div className={`${styles[`innerBread`]} ${styles[`breadThis`]}`}>
              <Link href="/product">
                <p className={`m-0`}>商品總覽</p>
              </Link>
            </div>
          </div>
          <div className={`${styles[`top-img-div`]}`}>
            <Link href="/product" className={`${styles[`titlebk`]}`}>
              <p className={`m-0`}>商品總覽</p>
            </Link>

            <Image
              src={`${process.env.NEXT_PUBLIC_FONT_URL}/images/product/product-top.png`}
              alt=""
              width={100}
              height={100}
            />
          </div>
          <div className={`${styles[`announce`]}`}>
            <FaBullhorn className={`${styles[`load`]}`} />
            <p>7/1 新品上市！ 各種好康商品任你選</p>
          </div>
        </div>

        <div className={`container-fluid ${styles[`two`]}`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_FONT_URL}/images/product/bg-top.png`}
            alt=""
            width={100}
            height={100}
          />
          <div className="container">
            {/* 限時特賣 */}
            <div className={`${styles[`countdown-container`]}`}>
              <span className={`${styles[`title`]}`}>限時特賣</span>
              <div className={`${styles[`countdown`]}`}>
                <div className={`${styles[`time-box`]}`}>
                  <span id="days">00</span>
                </div>
                <span className={`${styles[`unit`]}`}>天</span>
                <div className={`${styles[`time-box`]}`}>
                  <span id="hours">00</span>
                </div>
                <span className={`${styles[`unit`]}`}>時</span>
                <div className={`${styles[`time-box`]}`}>
                  <span id="minutes">00</span>
                </div>
                <span className={`${styles[`unit`]}`}>分</span>
                <div className={`${styles[`time-box`]}`}>
                  <span id="seconds">00</span>
                </div>
                <span className={`${styles[`unit`]}`}>秒</span>
              </div>
            </div>

            <div className={`${styles[`product-cards`]}`}>
              {specialProducts.map((product) => (
                <a
                  key={product.id}
                  className={`${styles[`product-card`]}`}
                  href={`/product/${product.id}`}
                >
                  <FaTag className={`${styles[`tag`]}`} />
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${product.img}`}
                    alt=""
                    width={100}
                    height={100}
                  />
                  <div className={`${styles[`product-card-right`]}`}>
                    <div className={`${styles[`right-title`]}`}>
                      {product.name}
                    </div>
                    <div className={`${styles[`right-down`]}`}>
                      <div className={`${styles[`price`]}`}>
                        <div className={`${styles[`price`]}`}>
                          <div
                            className={`${styles[`front-price`]} ${
                              product.discount !== 1
                                ? styles[`has-discount`]
                                : ``
                            }`}
                          >
                            ${product.price}
                          </div>
                          {product.discount !== 1 && (
                            <div className={`${styles[`off-price`]}`}>
                              ${(product.price * product.discount).toFixed(0)}
                              {/* 價格為無條件捨取 */}
                            </div>
                          )}
                        </div>
                      </div>
                      <button className={`${styles[`heart-btn`]}`}>
                        <FaHeart
                          className={`${styles[`heart`]} ${
                            favorites[product.id] ? styles[`active`] : ``
                          }`}
                          onClick={(e) => {
                            e.preventDefault() // 阻止默認行為
                            e.stopPropagation() // 阻止事件冒泡
                            toggleFavorite(product.id) // 切換收藏狀態
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={`container ${styles[`three`]}`}>
          <div className={`${styles[`product-top`]}`} id="ptop">
            <div className={`${styles[`filter`]}`}>
              {/* 種類選擇(大項) */}
              <FormControl
                variant="outlined"
                margin="normal"
                sx={{
                  width: `200px`,
                  margin: 0,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: `white`,
                    '& fieldset': {
                      borderColor: `white`,
                    },
                    '&:hover fieldset': {
                      borderColor: `white`,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: `white`,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: `#1b3947`, // 設置飄上去的字體顏色
                  },
                  '& .MuiSelect-root': {
                    fontSize: `1.4rem`, // 設置框框裡的字體大小
                  },
                  '& .MuiMenuItem-root': {
                    fontSize: `1.4rem`, // 設置下拉選單選項的字體大小
                  },
                }}
              >
                <InputLabel sx={{ fontSize: `1.3rem`, color: `#1b3947` }}>
                  種類
                </InputLabel>
                <Select
                  sx={{ fontSize: `1.4rem`, color: `#1b3947` }}
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value)
                    setCategoryId(``) // 重置細項類別
                    setCurrentPage(1) // Reset to first page
                  }}
                  label="種類"
                >
                  <MenuItem
                    value=""
                    sx={{ fontSize: `1.3rem`, color: `#1b3947` }}
                  >
                    全部
                  </MenuItem>
                  <MenuItem
                    value="bean"
                    sx={{ fontSize: `1.3rem`, color: `#1b3947` }}
                  >
                    咖啡豆
                  </MenuItem>
                  <MenuItem
                    value="machine"
                    sx={{ fontSize: `1.3rem`, color: `#1b3947` }}
                  >
                    咖啡機
                  </MenuItem>
                  <MenuItem
                    value="other"
                    sx={{ fontSize: `1.3rem`, color: `#1b3947` }}
                  >
                    其他/配件
                  </MenuItem>
                </Select>
              </FormControl>
              {/* 種類選擇(細項) */}
              {type && (
                <FormControl
                  variant="outlined"
                  margin="normal"
                  sx={{
                    width: `200px`,
                    margin: 0,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {},
                      '&:hover fieldset': {
                        borderColor: `#eba92a`,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: `#eba92a`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: `#1b3947`, // 設置飄上去的字體顏色
                    },
                    '& .MuiSelect-root': {
                      fontSize: `1.4rem`, // 設置框框裡的字體大小
                    },
                    '& .MuiMenuItem-root': {
                      fontSize: `1.4rem`, // 設置下拉選單選項的字體大小
                    },
                  }}
                >
                  <InputLabel sx={{ fontSize: `1.3rem`, color: `#1b3947` }}>
                    細項類別
                  </InputLabel>
                  <Select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value)
                      setCurrentPage(1) // Reset to first page
                    }}
                    sx={{ fontSize: `1.4rem`, color: `#1b3947` }}
                    label="細項類別"
                  >
                    <MenuItem
                      value=""
                      sx={{ fontSize: `1.3rem`, color: `#1b3947` }}
                    >
                      請選擇細項類別
                    </MenuItem>
                    {categories.map((category, index) => (
                      <MenuItem
                        key={category.id}
                        value={category.id}
                        sx={{ fontSize: `1.3rem`, color: `#1b3947` }}
                      >
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* 新增搜尋項目 */}
              <FormControl fullWidth>
                <TextField
                  label="提示文字"
                  variant="outlined"
                  placeholder="請輸入商品..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      getfindProduct()
                    }
                  }}
                  sx={{ height: 50 }}
                  InputProps={{
                    sx: {
                      height: 50,
                      fontSize: '16px',
                      '&::placeholder': {
                        fontSize: '18px', //似乎沒效果
                        color: '#999',
                      },
                    },
                  }}
                />
              </FormControl>

              {/* 搜尋按鈕 */}
              <Button
                variant="contained"
                onClick={(e) => getfindProduct()}
                sx={{
                  height: 45,
                  minWidth: 100,
                  fontSize: '12px',
                  px: 3, // 水平內距 padding
                }}
              >
                搜尋
              </Button>
            </div>

            {/* 顯示共幾筆資料 + 排序方式 */}
            <div className={`${styles[`order`]}`}>
              <p className={`${styles[`total`]}`}>共{totalProducts}筆資料</p>
              <FormControl
                variant="outlined"
                margin="normal"
                sx={{
                  width: `200px`,
                  margin: 0,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: `white`,
                    '& fieldset': {
                      borderColor: `white`,
                    },
                    '&:hover fieldset': {
                      borderColor: `white`,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: `white`,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: `#1b3947`,
                    fontSize: `1.4rem`,
                  },
                  '& .MuiSelect-root': {
                    fontSize: `1.4rem`,
                    color: `#1b3947`,
                  },
                  '& .MuiMenuItem-root': {
                    fontSize: `1.4rem`,
                    color: `#1b3947`,
                  },
                }}
              >
                <InputLabel>排序方式</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="排序方式"
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected === 'default') {
                      return '預設排序'
                    }
                    const labelMap = {
                      price_asc: '看最便宜',
                      price_desc: '看最貴',
                      rating_desc: '好評榜',
                      total_sold_desc: '熱銷榜',
                    }
                    return labelMap[selected] || ''
                  }}
                  sx={{ fontSize: `1.4rem`, color: `#1b3947` }}
                >
                  {/* 排除 default */}
                  <MenuItem
                    value="price_asc"
                    sx={{ fontSize: `1.3rem`, color: `#1b3947` }}
                  >
                    看最便宜
                  </MenuItem>
                  <MenuItem
                    value="price_desc"
                    sx={{ fontSize: `1.3rem`, color: `#1b3947` }}
                  >
                    看最貴
                  </MenuItem>
                  <MenuItem
                    value="rating_desc"
                    sx={{ fontSize: `1.3rem`, color: `#1b3947` }}
                  >
                    好評榜
                  </MenuItem>
                  <MenuItem
                    value="total_sold_desc"
                    sx={{ fontSize: `1.3rem`, color: `#1b3947` }}
                  >
                    熱銷榜
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* 商品渲染 */}
          <div className={`row gx-4 ${styles[`my-row`]}`}>
            {products.map((product) => (
              <div
                key={product.id}
                className={`col-6 col-md-4 col-lg-3 ${styles[`my-col`]}`}
                loading="lazy"
              >
                <a
                  className={`${styles[`overview-card`]}`}
                  href={`/product/${product.id}`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${product.img}`}
                    alt=""
                    loading="lazy" // 指定懶加載
                    width={100}
                    height={100}
                    onError={(e) => {
                      e.target.src = `${process.env.NEXT_PUBLIC_BACK_API}/images/hello/bd-8.webp`
                    }}
                  />
                  <div className={`${styles[`overview-down`]}`}>
                    <p className={`${styles[`overview-title`]}`}>
                      {product.name}
                    </p>

                    {/* 顯示星星的評分數 */}
                    {sortBy === `rating_desc` && (
                      <div className={`${styles[`rank-star`]}`}>
                        {product.average_score > 3.5 && (
                          <>
                            <span className={`${styles[`high-rating-label`]}`}>
                              好評榜
                            </span>
                            <p className="m-0">
                              {typeof product.average_score === `number`
                                ? product.average_score.toFixed(1)
                                : parseFloat(
                                    product.average_score || 0
                                  ).toFixed(1)}
                            </p>
                          </>
                        )}
                        {product.average_score < 3.5 &&
                          product.average_score > 1.0 && (
                            <p className="m-0">
                              {typeof product.average_score === `number`
                                ? product.average_score.toFixed(1)
                                : parseFloat(
                                    product.average_score || 0
                                  ).toFixed(1)}
                            </p>
                          )}
                        {product.average_score <= 1.0 && (
                          <p className="m-0">暫無評分</p>
                        )}

                        <FaStar className={`${styles[`yellow-star`]}`} />
                      </div>
                    )}

                    {/* 顯示銷售的情形 */}
                    {sortBy === `total_sold_desc` && (
                      <div>
                        {product.total_sold >= 30 && (
                          <div className="d-flex gap-1 align-items-center justify-content-between">
                            <span className={`${styles[`hot-selling-label`]}`}>
                              熱銷榜
                            </span>
                            <div className={`${styles[`nonono`]} d-flex gap-2`}>
                              <span className={`${styles[`hot-label`]}`}>
                                已售出
                              </span>
                              <p className="m-0">{product.total_sold}</p>
                            </div>
                          </div>
                        )}
                        {product.total_sold < 30 && product.total_sold > 1 && (
                          <div
                            className={`${
                              styles[`nonono`]
                            } d-flex gap-2 justify-content-end`}
                          >
                            <span className={`${styles[`hot-label`]}`}>
                              已售出
                            </span>
                            <p className="m-0">{product.total_sold}</p>
                          </div>
                        )}
                        {product.total_sold < 1 && (
                          <div
                            className={`${
                              styles[`nonono`]
                            } d-flex gap-2 justify-content-end`}
                          >
                            <span className={`${styles[`hot-label`]}`}>
                              暫未售出
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`${styles[`overview-bottom`]}`}>
                      <p className={`${styles[`overview-price`]}`}>
                        <div
                          className={`${styles[`front-price`]} ${
                            product.discount !== 1 ? styles[`has-discount`] : ``
                          }`}
                        >
                          ${product.price}
                        </div>
                        {product.discount !== 1 && (
                          <div className={`${styles[`off-price`]}`}>
                            ${(product.price * product.discount).toFixed(0)}
                            {/* 價格為無條件捨取 */}
                          </div>
                        )}
                      </p>
                      <button className={`${styles[`heart-btn`]}`}>
                        <FaHeart
                          className={`${styles[`heart`]} ${
                            favorites[product.id] ? styles[`active`] : ``
                          }`}
                          onClick={(e) => {
                            e.preventDefault() // 阻止默認行為
                            e.stopPropagation() // 阻止事件冒泡
                            toggleFavorite(product.id) // 切換收藏狀態
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* 換頁部分 */}
          <div className={`${styles[`pagination`]}`}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(1)
              }}
              className={currentPage === 1 ? styles.disabled : ``}
            >
              <FaAnglesLeft />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(currentPage - 1)
              }}
              className={currentPage === 1 ? styles.disabled : ``}
            >
              <FaAngleLeft />
            </a>
            {renderPagination()}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(currentPage + 1)
              }}
              className={currentPage === totalPages ? styles.disabled : ``}
            >
              <FaAngleRight />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(totalPages)
              }}
              className={currentPage === totalPages ? styles.disabled : ``}
            >
              <FaAnglesRight />
            </a>
          </div>
        </div>

        {/* 熱門推薦 + 好評如潮 */}
        <div className={`container-fluid ${styles[`four`]}`}>
          <Image
            className={`${styles[`bg-down`]}`}
            src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/bg-down.png`}
            alt=""
            width={100}
            height={100}
          />
          <div className={`container ${styles[`container-four`]}`}>
            <div className={`${styles[`ranking`]}`}>
              <div className={`d-flex ${styles[`four-title`]}`}>
                <p className={`d-flex ${styles[`title`]}`}>熱門推薦</p>
                <FaFire className={`${styles[`title-i`]}`} />
              </div>
              <div className={`${styles[`product-cards`]}`}>
                {hotProducts &&
                Array.isArray(hotProducts) &&
                hotProducts.length > 0 ? (
                  hotProducts.map((product, index) => (
                    <a
                      key={product.id}
                      className={`${styles[`product-card`]}`}
                      href={`/product/${product.id}`}
                    >
                      {/* 根據排名顯示相應的圖標 */}
                      <div className={`${styles[`ranking-icon`]}`}>
                        {index === 0 && <TbHexagonNumber1Filled />}
                        {index === 1 && <TbHexagonNumber2Filled />}
                        {index === 2 && <TbHexagonNumber3Filled />}
                      </div>

                      <Image
                        className={`${styles[`photo`]}`}
                        src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${product.img}`}
                        alt=""
                        width={100}
                        height={100}
                      />
                      <div className={`${styles[`product-card-right`]}`}>
                        <div className={`${styles[`right-title`]}`}>
                          {product.name}
                        </div>

                        <div className={`${styles[`right-down`]}`}>
                          <div className={`${styles[`price`]}`}>
                            <div
                              className={`${styles[`front-price`]} ${
                                product.discount !== 1
                                  ? styles[`has-discount`]
                                  : ``
                              }`}
                            >
                              ${product.price}
                            </div>
                            {product.discount !== 1 && (
                              <div className={`${styles[`off-price`]}`}>
                                ${(product.price * product.discount).toFixed(0)}
                              </div>
                            )}
                          </div>
                          <div className="d-flex gap-4 align-items-center">
                            <div className={`${styles[`nonono`]} d-flex gap-1`}>
                              <span className={`${styles[`hot-label`]}`}>
                                已售出
                              </span>
                              <p className="m-0">{product.total_sold}</p>
                            </div>
                            <button className={`${styles[`heart-btn`]}`}>
                              <FaHeart
                                className={`${styles[`heart`]} ${
                                  favorites[product.id] ? styles[`active`] : ``
                                }`}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  toggleFavorite(product.id)
                                }}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <p>No hot products found.</p>
                )}
              </div>

              <a
                className={`d-flex ${styles[`view-more`]}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  const productTop = document.querySelector(
                    `.${styles[`product-top`]}`
                  )
                  if (productTop) {
                    productTop.scrollIntoView({ behavior: `smooth` })
                  }
                  setSortBy(`total_sold_desc`) // 切換排序為"熱門榜"
                  setType(``)
                  setCategoryId(``)
                  setCurrentPage(1)
                }}
              >
                <p>查看更多</p>
                <FaAngleRight />
              </a>
            </div>
            <div className={`${styles[`good-command`]}`}>
              <div className={`d-flex ${styles[`four-title`]}`}>
                <p className={`d-flex ${styles[`title`]}`}>好評如潮</p>
                <FaUsers className={`${styles[`title-i`]}`} />
              </div>
              <div className={`${styles[`product-cards`]}`}>
                {topRatedProducts.map((product) => (
                  <a
                    key={product.id}
                    className={`${styles[`product-card`]}`}
                    href={`/product/${product.id}`}
                  >
                    <div className={`${styles[`rank-star`]}`}>
                      <p className="m-0">
                        {typeof product.average_score === `number`
                          ? product.average_score.toFixed(1)
                          : parseFloat(product.average_score || 0).toFixed(1)}
                      </p>
                      <FaStar className={`${styles[`yellow-star`]}`} />
                    </div>
                    <Image
                      className={`${styles[`photo`]}`}
                      src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${product.img}`}
                      alt=""
                      width={100}
                      height={100}
                    />
                    <div className={`${styles[`product-card-right`]}`}>
                      <div className={`${styles[`right-title`]}`}>
                        {product.name}
                      </div>
                      <div className={`${styles[`right-down`]}`}>
                        <div className={`${styles[`price`]}`}>
                          <div
                            className={`${styles[`front-price`]} ${
                              product.discount !== 1
                                ? styles[`has-discount`]
                                : ``
                            }`}
                          >
                            ${product.price}
                          </div>
                          {product.discount !== 1 && (
                            <div className={`${styles[`off-price`]}`}>
                              ${(product.price * product.discount).toFixed(0)}
                              {/* 價格為無條件捨取 */}
                            </div>
                          )}
                        </div>
                        <button className={`${styles[`heart-btn`]}`}>
                          <FaHeart
                            className={`${styles[`heart`]} ${
                              favorites[product.id] ? styles[`active`] : ``
                            }`}
                            onClick={(e) => {
                              e.preventDefault() // 阻止默認行為
                              e.stopPropagation() // 阻止事件冒泡
                              toggleFavorite(product.id) // 切換收藏狀態
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <a
                className={`d-flex ${styles[`view-more`]}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  const productTop = document.querySelector(
                    `.${styles[`product-top`]}`
                  )
                  if (productTop) {
                    productTop.scrollIntoView({ behavior: `smooth` })
                  }
                  setSortBy(`rating_desc`) // 切換排序為"好評榜"
                  setType(``)
                  setCategoryId(``)
                  setCurrentPage(1)
                }}
              >
                <p>查看更多</p>
                <FaAngleRight />
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
