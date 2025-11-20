import React from 'react'
import styles from '@/styles/cartProductList.module.scss'
import Image from 'next/image'
import { useCart } from '@/hooks/use-cart'
import { FaMinus, FaPlus } from 'react-icons/fa'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'
import { useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/router'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'
// sweetalert 包裝
const MySwal = withReactContent(Swal)

// .env 檔案載入(共用api部分)
import 'dotenv/config.js'

export default function ProductCartList() {
  const {
    cartItems = [], // 取出購物車商品（來自 cartState.items）
    updateItemQty, // 改變商品數量
    removeItem, // 移除商品
  } = useCart()

  const router = useRouter()
  const { pid } = router.query
  const [product, setProduct] = useState(null)

  // 取得單一商品詳細資料（可選）
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACK_API}/api/product/${pid}`
        )
        setProduct(response.data.data)
      } catch (error) {
        console.error('Error fetching product details:', error)
      }
    }

    if (pid) fetchProductDetails()
  }, [pid])

  // sweetalert 彈出確認刪除
  const notifyAndRemove = (productName, productId) => {
    MySwal.fire({
      icon: 'warning',
      title: '確定要刪除？',
      confirmButtonText: '確定',
      showCancelButton: true,
      cancelButtonText: '取消',
      confirmButtonColor: '#2b4f61',
      customClass: {
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom',
      },
      didOpen: () => {
        const confirmBtn = document.querySelector('.swal2-confirm-custom')
        const cancelBtn = document.querySelector('.swal2-cancel-custom')

        if (confirmBtn) {
          confirmBtn.style.fontSize = '16px'
          confirmBtn.style.padding = '7px 18px'
        }

        if (cancelBtn) {
          cancelBtn.style.fontSize = '16px'
          cancelBtn.style.padding = '7px 18px'
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: '刪除成功!',
          showConfirmButton: false,
          timer: 1000,
        })

        removeItem(productId)
      }
    })
  }

  // 點擊「＋」數量增加
  const handleIncrease = (id, currentQty) => {
    updateItemQty(id, currentQty + 1)
  }

  // 點擊「－」數量減少（如果為 0 則刪除）
  const handleDecrease = (id, currentQty, productName) => {
    const nextQty = currentQty - 1
    if (nextQty <= 0) {
      notifyAndRemove(productName, id)
    } else {
      updateItemQty(id, nextQty)
    }
  }

  return (
    <>
      <div className={`${styles['main-left-area']}`}>
        <div className={`py-2 d-md-block d-none ${styles['main-left-title']}`}>
          <ul className={`d-md-flex d-none list-unstyled`}>
            <li className="me-auto ms-5">商品</li>
            <li className="col-md-2 d-flex justify-content-center">數量</li>
            <li className="col-md-2 d-flex justify-content-center">單價</li>
            <li className="col-md-2 d-flex justify-content-center">總計</li>
          </ul>
        </div>

        <div className={styles['main-left-body']}>
          {cartItems.map((product) => (
            <ul key={product.id} className="list-unstyled d-flex pt-4">
              {/* 商品資訊 */}
              <li className={`me-auto ${styles['summary2']}`}>
                <div className="d-flex gap-4">
                  <div className={`ms-3 col-2 ${styles['products-img']}`}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${product.img}`}
                      width={500}
                      height={500}
                      alt=""
                      className="w-100 h-100"
                    />
                  </div>
                  <div className="col-8 d-flex flex-column justify-content-evenly">
                    <Link
                      title={product.name}
                      className={`text-decoration-none ms-3 ${styles['title']}`}
                      href={`/product/${product.id}`}
                    >
                      {product.name}
                    </Link>
                    <div>
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          notifyAndRemove(product.name, product.id)
                        }
                      >
                        <DeleteIcon sx={{ fontSize: '1.8rem' }} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </li>

              {/* 數量控制 */}
              <li
                className={`col-2 d-flex align-items-center justify-content-center ${styles['summary3']}`}
              >
                <div className={`d-flex ${styles['counter-container']}`}>
                  <button
                    onClick={() =>
                      handleDecrease(product.id, product.quantity, product.name)
                    }
                    className={`btn ${styles['counter-btn']}`}
                  >
                    <FaMinus />
                  </button>

                  <div className={styles['counter-value']} id="counter">
                    {product.quantity}
                  </div>

                  <button
                    onClick={() => handleIncrease(product.id, product.quantity)}
                    className={`btn ${styles['counter-btn']}`}
                  >
                    <FaPlus />
                  </button>
                </div>
              </li>

              {/* 單價 */}
              <li
                className={`col-2 d-flex align-items-center justify-content-center ${styles['summary4']}`}
              >
                ${product.price}
              </li>

              {/* 總計 */}
              <li
                className={`col-2 d-flex align-items-center justify-content-center ${styles['summary5']}`}
              >
                ${product.price * product.quantity}
              </li>
            </ul>
          ))}
        </div>
      </div>
    </>
  )
}
