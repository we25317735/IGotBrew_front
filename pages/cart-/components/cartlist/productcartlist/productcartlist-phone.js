import React from 'react'
import styles from '@/styles/cartProductListPhone.module.scss'
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
export default function ProductCartList() {
  const {
    cartItems = [],
    handleDecrease = () => {},
    handleIncrease = () => {},
    handleRemove = () => {},
  } = useCart()

  const MySwal = withReactContent(Swal)
  const router = useRouter()
  const { pid } = router.query
  const [product, setProduct] = useState(null)
  const notifyAndRemove = (poroductName, productId) => {
    MySwal.fire({
      icon: 'warning',
      title: '確定要刪除？',
      text: '',
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

        handleRemove(productId)
      }
    })
  }
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

    fetchProductDetails()
  }, [pid])
  return (
    <>
      <div className={`ms-3 ${styles['main-left-area']}`}>
        <div
          className={`py-2 ps-4 ${styles['main-left-title']} ${styles['h2']}`}
        >
          商品
        </div>
        <div className={`${styles['main-left-body']}`}>
          {cartItems.map((product) => {
            return (
              <ul key={product.id} className={`list-unstyled d-flex pt-3`}>
                <div className="d-flex gap-4 col-11">
                  <div className={`ms-3 col-1 ${styles['products-img']}`}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${product.img}`}
                      width={500}
                      height={500}
                      alt=""
                      className="w-100 h-100"
                    ></Image>
                  </div>
                  <div className="ms-2 col-7 d-flex flex-column justify-content-between">
                    <Link
                      className={`text-decoration-none ${styles['h5']} ${styles['title']}`}
                      href={`http://localhost:3000/product/${product.id}`}
                    >
                      {product.name}
                    </Link>

                    <div className="d-flex justify-content-between mt-2">
                      <div className={` ${styles.h6}`}>${product.price}</div>
                      <div className={`d-flex ${styles['counter-container']}`}>
                        <button
                          onClick={() => {
                            const nextQty = product.qty - 1
                            if (nextQty <= 0) {
                              notifyAndRemove(product.name, product.id)
                            } else {
                              handleDecrease(product.id)
                            }
                          }}
                          className={`btn ${styles['counter-btn']}`}
                        >
                          <FaMinus />
                        </button>
                        <div
                          className={`${styles['counter-value']}`}
                          id="counter"
                        >
                          {product.qty}
                        </div>
                        <button
                          onClick={() => {
                            handleIncrease(product.id)
                          }}
                          className={`btn ${styles['counter-btn']}`}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto my-auto ">
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        notifyAndRemove(product.name, product.id)
                      }}
                    >
                      <DeleteIcon
                        sx={{
                          fontSize: '2.4rem',
                        }}
                      />
                    </IconButton>
                  </div>
                </div>
              </ul>
            )
          })}
        </div>
      </div>
    </>
  )
}
