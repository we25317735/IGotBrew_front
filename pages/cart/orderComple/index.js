import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from '@/styles/orderComple.module.scss'
import { Button } from '@mui/material'
import { BsCheckCircle } from 'react-icons/bs'
import { useRouter } from 'next/router'
import LoadLink from '@/components/LoadLink'

import HotProduct from '@/pages/cart/components/hotproduct/hotproduct'
import Loading from '@/components/Loading'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart_header from '../components/cart_header'

import 'dotenv/config.js' // .env 檔案載入(共用api部分)

// 測試: localhost:3000/cart/searchOrder?86d09a3d-09bd-46cb-81c7-a8c202f9c0a5

export default function OrderDetail() {
  const [orderData, setOrderData] = useState([])
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入設定
  const router = useRouter()
  const { transaction_id } = router.query

  useEffect(() => {
    if (!transaction_id) return // 防呆，沒有 transaction_id 就不跑

    const getData = async () => {
      const API = `${process.env.NEXT_PUBLIC_BACK_API}/cart/searchOrder/${transaction_id}`
      const res = await axios.get(API) // 取得訂單訊息 API

      if (res.data.status === 'success') {
        setOrderData(res.data.data) // 注意：後端回傳的單筆訂單在 data 裡
      }
    }

    getData()
  }, [transaction_id])

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
      <div className={`g-0 container-fluid ${styles.cart}`}>
        <Header />
        <div
          className={`row mx-3 justify-content-center mb-5 ${styles.cartTitle}`}
        >
          <Cart_header active={3} />
        </div>
        <div className={`${styles['cart-body']} `}>
          <div className="mb-5 mt-md-0 mt-5 text-center ">
            <BsCheckCircle className={`${styles.finishIcon}`} />
          </div>
          <div className={`text-center ${styles.h1} `}>
            本次訂單已完成!
            <div className="mt-5 ms-md-0 ms-3 d-flex justify-content-center">
              <ul
                className={`list-unstyled text-start me-5 ${styles['item1']}`}
              >
                <li>訂單編號：</li>
                <li>訂單日期：</li>
                <li>總金額：</li>
                <li>付款方式：</li>
              </ul>

              <ul className={`list-unstyled text-start ${styles['item2']}`}>
                <li>{transaction_id}</li>
                <li>{orderData.created_at}</li>
                <li>${orderData.amount}</li>
                <li>{orderData.pay_type === 1 ? '信用卡' : 'Line Pay'}</li>
              </ul>
            </div>
            <div className="mb-5 d-flex justify-content-center gap-md-5 gap-3 ">
              <div className="ms-md-0 ms-5">
                <LoadLink href="/IGotBrew" title="正在前往首頁">
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#2B4f61',
                      color: '#2B4f61',
                      fontSize: '18px',
                      '@media (max-width: 391px)': {
                        transform: 'scale(0.8)',
                        transformOrigin: 'top left',
                        textWrap: 'nowrap',
                        fontSize: '16px',
                      },
                      '&:hover': {
                        borderColor: '#2B4f61',
                        backgroundColor: '#2B4f61',
                        color: 'white',
                      },
                    }}
                  >
                    回首頁
                  </Button>
                </LoadLink>
              </div>
              <div>
                <LoadLink href="/user/orders" title="正在前往會員中心">
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#2B4f61',
                      color: '#2B4f61',
                      fontSize: '18px',
                      '@media (max-width: 391px)': {
                        transform: 'scale(0.8)',
                        transformOrigin: 'top left',
                        textWrap: 'nowrap',
                        fontSize: '16px',
                      },
                      '&:hover': {
                        borderColor: '#2B4f61',
                        backgroundColor: '#2B4f61',
                        color: 'white',
                      },
                    }}
                  >
                    查看訂單
                  </Button>
                </LoadLink>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.hotproduct}`}>
          <HotProduct />
        </div>
        <Footer />
      </div>
    </>
  )
}
