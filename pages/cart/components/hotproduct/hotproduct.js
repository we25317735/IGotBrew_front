import React, { useState, useEffect } from 'react'
import styles from '@/styles/cartHotProduct.module.scss'
import Image from 'next/image'
import axios from 'axios'
import Link from 'next/link'

// .env 檔案載入(共用api部分)
import 'dotenv/config.js'

// cart.js 裡面 熱門商品組件
export default function HotProduct() {
  const [productData, setProductData] = useState([])

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACK_API}/cart/searchproduct`)
      .then((res) => {
        setProductData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <div className={`d-md-block d-none ${styles['cart-footer']}`}>
        <div className={`${styles['cart-bottom-title']} ${styles['h3']}`}>
          推薦商品
        </div>
        <div className="d-flex col-12 mt-4 justify-content-center gap-5">
          {productData.map((v) => {
            return (
              <a
                className="text-decoration-none"
                href={`${process.env.NEXT_PUBLIC_BACK_API}/product/${v.id}`}
                key={v.id}
              >
                <div className={`d-flex ${styles['product-card']}`}>
                  <div className="d-flex flex-column gap-3">
                    <div className={`${styles['product-img']}`}>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${v.img}`}
                        alt=""
                        width={500}
                        height={500}
                        className="w-100 h-100"
                      ></Image>
                    </div>
                    <div>
                      <div className={` text-start ${styles['product-title']}`}>
                        {v.name}
                      </div>
                      <div className={`text-start ${styles['product-price']}`}>
                        ${v.price}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            )
          })}
          <div className="d-flex align-items-end">
            <Link href={`${process.env.NEXT_PUBLIC_BACK_API}/product`}></Link>
          </div>
        </div>
      </div>
    </>
  )
}
