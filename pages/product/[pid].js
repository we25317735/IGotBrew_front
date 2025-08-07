import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from '@/styles/productDetail.module.scss'
import Image from 'next/image'
import { FaMinus, FaHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { IoMdAdd } from 'react-icons/io'
import { FiMinus } from 'react-icons/fi'
import { FaAngleRight } from 'react-icons/fa6'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { FaRegStar } from 'react-icons/fa'
import { IoMdMore } from 'react-icons/io'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import Swal from 'sweetalert2'
import Loading from '@/components/Loading'
import { FaAngleUp } from 'react-icons/fa'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'

// .env 檔案載入(共用api部分)
import 'dotenv/config.js'

export default function ProductDetail({ productRes }) {
  const [product, setProduct] = useState(productRes) // 頁面基礎資訊(SSR 預設)
  const [quantity, setQuantity] = useState(1) // 購買數量加減
  const [favorites, setFavorites] = useState({}) // 使用者商品關注
  const [newComment, setNewComment] = useState('') // 留言
  const [newRating, setNewRating] = useState(0) // 星星評價

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedComment, setEditedComment] = useState('')
  const [editedRating, setEditedRating] = useState(0)
  const [showMenuForCommentId, setShowMenuForCommentId] = useState(0)
  const [showButton, setShowButton] = useState(false) // Top 按鈕
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 初始載入設定

  const router = useRouter()
  const {
    setCartCheckout, // 儲存結帳時狀態
    addItem,
    removeItem,
    updateItemQty,
    clearCart,
    isInCart,
  } = useCart() // 購物車 hook

  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分
  const { pid } = router.query

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth])

  // 調取 URL 值
  useEffect(() => {
    if (pid) {
      ProductDetails()
      fetchFavorites()
    }
  }, [pid, auth])

  // 滾輪監聽( TOP 按鈕)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !showButton) {
        setShowButton(true)
      } else if (window.scrollY <= 300 && showButton) {
        setShowButton(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showButton])

  // 取得商品詳情
  const ProductDetails = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACK_API}/product/${pid}`
    )
    setProduct(response.data.data)
  }

  // 留言編輯
  const EditComment = async (commentId) => {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACK_API}/product/comment/${commentId}`,
      {
        score: editedRating,
        comment: editedComment,
      }
    )

    if (res.status === 200) {
      ProductDetails()
      setEditingCommentId(null)
    } else {
      console.error('Failed to edit comment')
    }
  }

  // 留言刪除
  const CancelComment = async (commentId) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACK_API}/product/comment/${commentId}`
    )

    // axios 若請求失敗（例如 404、500）會直接 throw error
    // 所以這邊只處理成功的情況
    if (response.status === 200) {
      ProductDetails()
    } else {
      console.error('Failed to delete comment')
    }
  }

  // 新增留言
  const AddComment = async () => {
    // 1. 檢查是否已經留言過
    const checkRes = await axios.get(
      `${process.env.NEXT_PUBLIC_BACK_API}/product/${product.id}/comment`,
      {
        params: {
          user_id: auth.userData.id, // 當前使用者 id
        },
      }
    )

    // 2. 如果回傳 true 表示留言過並終止新增
    if (checkRes.data) {
      Swal.fire({
        title: '已經留言過了唷',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '確認',
      })
      return
    }

    // 3. 新增留言
    const addRes = await axios.post(
      `${process.env.NEXT_PUBLIC_BACK_API}/product/comment`,
      {
        user_id: auth.userData.id,
        product_id: product.id,
        score: newRating, // 星星評價
        comment: newComment, // 留言內容
      }
    )

    if (addRes.status === 200 || addRes.status === 201) {
      ProductDetails()
      setNewComment('')
      setNewRating(0)
    }
  }

  // 加入購物車
  const handleAddToCart = () => {
    const cartItem = {
      user: auth.userData.id,
      classification: 'product',
      id: product.id,
      name: product.name,
      img: product.img,
      price: Math.floor(product.price * product.discount), // 必要, 用來計算總金額
      quantity: quantity, // 必要, 用來計算總數量
    }

    addItem(cartItem) // ← 由 context 處理邏輯與 localStorage

    Swal.fire({
      title: '已加入購物車',
      icon: 'success',
      position: 'top',
      showConfirmButton: false,
      timer: 1000,
      toast: true,
      color: '#1b3947',
    })
  }

  const addToCart = () => {
    handleAddToCart({ ...product, quantity })
  }

  // 使用者關注商品(渲染)
  const fetchFavorites = async () => {
    if (!auth.isAuth) return

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACK_API}/product/favorites/${auth.userData.id}`
    )

    const data = response.data

    if (data.status === 'success') {
      const favMap = {}
      data.favorites.forEach((fav) => {
        favMap[fav.product_id] = true
      })
      setFavorites(favMap)
    }
  }

  // 新增或取消商品關注
  const toggleFavorite = async (productId) => {
    if (!auth.isAuth) {
      Swal.fire({
        title: '請先登入',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '確認',
      })
      return
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACK_API}/product/favorite`,
      {
        user_id: auth.userData.id,
        product_id: productId,
      }
    )

    const data = response.data

    if (data.status === 'success') {
      // 吐司
      if (data.message === '已添加收藏') {
        toast.success('已加入關注')
      } else {
        toast('已取消關注', {
          icon: '💔',
        })
      }

      // icon 點亮 或取消
      setFavorites((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }))
    }
  }

  // 初始載入 loading
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])

  // isInitialLoad 後續變更
  if (isInitialLoad) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <>
      <div className={`container-fluid ${styles.backg} mt-3 p-0`}>
        <Header />

        {/* 吐司 */}
        <div className={`container ${styles.one} mt-5`}>
          <div className={`${styles['bread']}`}>
            <div className={`${styles['innerBread']}`}>
              <Link href="/IGotBrew">首頁</Link>
              <FaAngleRight />
            </div>
            <div className={`${styles['innerBread']}`}>
              <Link href="/IGotBrew">線上商店</Link>
              <FaAngleRight />
            </div>
            <div className={`${styles['innerBread']}`}>
              <Link href="/product">商品總覽</Link>
              <FaAngleRight />
            </div>
            <div className={`${styles['innerBread']} ${styles['breadThis']}`}>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  router.reload() // 強制刷新當前頁面
                }}
              >
                <p className={`m-0`}>商品細節</p>
              </Link>
            </div>
          </div>
        </div>

        <div className={`container ${styles.two}`}>
          <div className={`${styles['product-card']}`}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${product.img}`}
              alt={product.name}
              width={500}
              height={500}
              onError={(e) => {
                e.target.src = `${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/bd-8.webp`
              }}
            />
            <div className={`${styles['product-card-right']}`}>
              <div className={`${styles['right-top']}`}>
                <div className={`${styles['right-title']}`}>{product.name}</div>
                <div
                  className={`${styles['right-content']}`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {(product.content || '').replace(/rn/g, '\n')}
                </div>
              </div>

              <div className={`${styles['right-down']}`}>
                <div className={`${styles['left']}`}>
                  <div className={`${styles['price-heart']}`}>
                    {/* 商品價格 */}
                    <div className={`${styles['price']}`}>
                      <div
                        className={`${styles['front-price']} ${
                          product.discount !== 1 ? styles['has-discount'] : ''
                        }`}
                      >
                        ${product.price}
                      </div>
                      {product.discount !== 1 && (
                        <div className={`${styles['off-price']} `}>
                          ${(product.price * product.discount).toFixed(0)}
                          {/* 價格為無條件捨取 */}
                        </div>
                      )}
                    </div>

                    {/* 關注按鈕 */}
                    <button className={`${styles['heart-btn']}`}>
                      <FaHeart
                        className={`${styles['heart']} ${
                          favorites[product.id] ? styles['active'] : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleFavorite(product.id)
                        }}
                      />
                    </button>
                  </div>

                  {/* 購買數量 */}
                  <div className={`${styles['count-product']}`}>
                    <button
                      className={`${styles['reduce']}`}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <FiMinus className={`${styles['add-amount']}`} />
                    </button>
                    <p>{quantity}</p>
                    <button
                      className={`${styles['add']}`}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <IoMdAdd className={`${styles['add-amount']}`} />
                    </button>
                  </div>
                </div>

                {/* 結帳 + 加入購物車 */}
                <div className={`${styles['product-down-right']}`}>
                  <button
                    className={`${styles.straight} ${styles['down-button']}`}
                  >
                    <p className={`m-0`}>直接結帳</p>
                  </button>
                  <button
                    className={`${styles['add-cart']} ${styles['down-button']}`}
                    onClick={addToCart}
                  >
                    <p className={`m-0`}>加入購物車</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {product.detailImgs.length > 0 && (
          <div className={`container`}>
            <div className={`${styles['three']}`}>
              <p className={`${styles['title']}`}>商品詳情</p>
              {product.detailImgs.map((img, index) => (
                <Image
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/detail-img/${img}`}
                  alt={`Detail ${index + 1}`}
                  width={500}
                  height={500}
                />
              ))}
            </div>
          </div>
        )}

        {[
          { title: '內容物', content: product.weight },
          { title: '原產地', content: product.origin },
          { title: '保存期限', content: product.life },
          { title: '廠商名稱', content: product.trade },
        ].filter((item) => item.content).length > 0 && (
          <div className={`container`}>
            <div className={`${styles['three-s']}`}>
              <p className={`${styles['title']}`}>規格詳情</p>
              <div className={`${styles['formaty']} d-flex`}>
                {[
                  { title: '內容物', content: product.weight },
                  { title: '原產地', content: product.origin },
                  { title: '保存期限', content: product.life },
                  { title: '廠商名稱', content: product.trade },
                ]
                  .filter((item) => item.content)
                  .map((item, index) => (
                    <div
                      className={`${styles['formaty-list']} d-flex`}
                      key={index}
                    >
                      <p className={`${styles['formaty-title']}`}>
                        {item.title}
                      </p>
                      <p className={`${styles['formaty-content']}`}>
                        {item.content}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <div className={`${styles['four']} container`}>
          <div className={`${styles['rankstar-div']} d-flex`}>
            <div className={`${styles['rank-top']} d-flex`}>
              <p>
                {typeof product.average_score === 'number'
                  ? product.average_score.toFixed(1)
                  : parseFloat(product.average_score || 0).toFixed(1)}
              </p>
              <div className={`${styles['stars']}`}>
                {[...Array(5)].map((_, index) => {
                  const score = product.average_score
                  if (score >= index + 1) {
                    return (
                      <FaStar
                        key={index}
                        className={`${styles['yellow-star']}`}
                      />
                    )
                  } else if (score > index && score < index + 1) {
                    return (
                      <FaStarHalfAlt
                        key={index}
                        className={`${styles['yellow-star']}`}
                      />
                    )
                  } else {
                    return (
                      <FaRegStar
                        key={index}
                        className={`${styles['gray-star']}`}
                      />
                    )
                  }
                })}
              </div>
            </div>
            <div className={`${styles['rank-middle']}`}>
              共{product.review_count}則評價
            </div>
            {product.review_count !== 0 && (
              <div className={`${styles['rank-bottom']}`}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = product.comments.filter(
                    (comment) => Math.round(comment.score) === rating
                  ).length
                  //篩選出所有評分四捨五入後= 此行分數的評論數量

                  const percentage = (count / product.review_count) * 100
                  //某個評分等級的評論數量佔總評論數量的百分比
                  return (
                    <div className={`${styles['bottom-detail']}`} key={rating}>
                      <p>{rating}.0</p>
                      <FaStar />
                      <div
                        className={`${styles.percent} ${
                          percentage === 0 ? styles.gray : ''
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                      <p>{percentage.toFixed(0)}%</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className={`${styles['commenter']}`}>
            <div className={`${styles['four-title']} d-flex mb-5`}>
              <p className={`${styles['title']}`}>最新評價</p>
            </div>
            <div className={`${styles['comments']}`}>
              {product.comments.length > 0 ? (
                product.comments.map((comment, index) => (
                  <div
                    className={`d-flex ${styles['inner-comment']} `}
                    key={index}
                  >
                    <div className={`${styles['comment-top']} d-flex`}>
                      <div className={`${styles['avatar']}`}>
                        <Image
                          src={
                            comment.user_img
                              ? `${process.env.NEXT_PUBLIC_BACK_IMG}/images/user/${comment.user_img}`
                              : `${process.env.NEXT_PUBLIC_BACK_IMG}/images/detail-img/defaultauth.userData.jpg`
                          }
                          alt="Avatar"
                          width={50}
                          height={50}
                          className={`${styles['avatarImg']}`}
                        />
                      </div>
                      <p className={`${styles['comment-name']}`}>
                        {comment.user_name || '王小明'}
                      </p>

                      {editingCommentId === comment.id ? (
                        <div
                          className={`${styles['comment-stars']} d-flex gap-1`}
                        >
                          {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1
                            return (
                              <FaStar
                                key={index}
                                className={`${styles['starrr']}`}
                                style={{ fontSize: '15px', cursor: 'pointer' }}
                                color={
                                  ratingValue <= editedRating
                                    ? '#ffc107'
                                    : '#e4e5e9'
                                }
                                onClick={() => setEditedRating(ratingValue)}
                              />
                            )
                          })}
                        </div>
                      ) : (
                        <div
                          className={`${styles['comment-stars']} d-flex gap-1 ms-3`}
                        >
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${styles['yellow-star']}`}
                              style={{
                                color:
                                  i < Math.round(comment.score)
                                    ? '#eba92a'
                                    : '#D3D3D3',
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {editingCommentId === comment.id ? (
                        ''
                      ) : (
                        <p className={`${styles['comment-time']} ms-3`}>
                          {new Date(comment.formatted_date).toLocaleDateString(
                            'zh-TW'
                          )}
                        </p>
                      )}

                      {comment.user_id === auth.userData?.id && (
                        <div className={styles['comment-actions']}>
                          <IoMdMore
                            onClick={() => {
                              showMenuForCommentId !== comment.id
                                ? setShowMenuForCommentId(comment.id)
                                : setShowMenuForCommentId(null)
                            }}
                            className={styles['threep']}
                          />
                          {showMenuForCommentId === comment.id && (
                            <div className={styles['comment-action-menu']}>
                              <button
                                onClick={() => {
                                  setEditedComment(comment.comment)
                                  setEditedRating(comment.score)
                                  setEditingCommentId(comment.id)
                                  setShowMenuForCommentId(null)
                                }}
                              >
                                編輯
                              </button>
                              <button
                                onClick={() => {
                                  Swal.fire({
                                    title: '確認刪除留言與評分？',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#d2d2d2',
                                    confirmButtonText: '確認',
                                    cancelButtonText: '取消',
                                    customClass: {
                                      confirmButton: 'swal2-confirm-custom',
                                      cancelButton: 'swal2-cancel-custom',
                                    },
                                    didOpen: () => {
                                      const confirmBtn = document.querySelector(
                                        '.swal2-confirm-custom'
                                      )
                                      const cancelBtn = document.querySelector(
                                        '.swal2-cancel-custom'
                                      )

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
                                      setEditingCommentId(comment.id)
                                      CancelComment(comment.id)
                                      setShowMenuForCommentId(null)
                                    }
                                  })
                                }}
                              >
                                刪除
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {editingCommentId === comment.id ? (
                      <div>
                        <textarea
                          className={styles['editable-textarea']}
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                        />
                        <div className={styles['button-container']}>
                          <button
                            onClick={() => {
                              if (editedRating === 0) {
                                Swal.fire({
                                  title: '請選擇評分星星數',
                                  icon: 'warning',
                                  confirmButtonColor: '#2b4f61',
                                  confirmButtonText: '確認',
                                })
                              } else {
                                EditComment(comment.id)
                              }
                            }}
                            className={`${styles['origin-button']}`}
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className={`${styles['another-button']}`}
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className={`${styles['comment-bottom']}`}>
                        {comment.comment || '尚未輸入評論'}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className={`${styles['no-comments']}`}>暫無評論</p>
              )}
              {!auth.isAuth ? (
                <div className={`${styles['login-message']}`}>
                  請登入後再留言
                </div>
              ) : (
                <div className={`d-flex border-0 ${styles['inner-comment']}`}>
                  <div className={`d-flex ${styles['comment-top']}`}>
                    <div className={`${styles['avatar']}`}>
                      <Image
                        src={
                          auth
                            ? `${process.env.NEXT_PUBLIC_BACK_API}/images/user/${auth.userData.img}`
                            : `${process.env.NEXT_PUBLIC_BACK_API}/images/detail-img/avatar.png`
                        }
                        alt="Avatar"
                        width={50}
                        height={50}
                        className={`${styles['avatarImg']}`}
                      />
                    </div>
                    <input
                      className={`d-flex ${styles['enter-comment']}`}
                      placeholder="留言......"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />

                    <div className={`d-flex ${styles['enter-rank']}`}>
                      <div
                        className={`${styles['comment-stars']} d-flex gap-1`}
                      >
                        {[...Array(5)].map((_, index) => {
                          const ratingValue = index + 1
                          return (
                            <FaStar
                              key={index}
                              className={`${styles['starrr']}`}
                              color={
                                ratingValue <= newRating ? '#ffc107' : '#e4e5e9'
                              }
                              onClick={() => setNewRating(ratingValue)}
                            />
                          )
                        })}
                      </div>
                      <button
                        onClick={() => {
                          if (newRating === 0) {
                            Swal.fire({
                              title: '請選擇評分星星數',
                              icon: 'warning',
                              confirmButtonColor: '#2b4f61',
                              confirmButtonText: '確認',
                            })
                          } else {
                            AddComment()
                          }
                        }}
                      >
                        評論
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`container ${styles.five}`}>
          <div className={`${styles['four-title']} d-flex`}>
            <p className={`${styles['title']}`}>相關商品</p>
          </div>
          <div className={`row gx-4 ${styles['my-row']}`}>
            {product.relatedProducts.map((relatedProduct, index) => (
              <div
                className={`col-6 col-md-4 col-lg-3 ${styles['my-col']}`}
                key={index}
              >
                <a
                  className={`${styles['overview-card']}`}
                  href={`/product/${relatedProduct.id}`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${relatedProduct.img}`}
                    alt={relatedProduct.name}
                    width={500}
                    height={500}
                  />
                  <div className={`${styles['overview-down']}`}>
                    <p className={`${styles['overview-title']}`}>
                      {relatedProduct.name}
                    </p>
                    <div className={`${styles['overview-bottom']}`}>
                      <p className={`${styles['overview-price']}`}>
                        <div
                          className={`${styles['front-price']} ${
                            relatedProduct.discount !== 1
                              ? styles['has-discount']
                              : ''
                          }`}
                        >
                          ${relatedProduct.price}
                        </div>
                        {relatedProduct.discount !== 1 && (
                          <div className={`${styles['off-price']}`}>
                            $
                            {(
                              relatedProduct.price * relatedProduct.discount
                            ).toFixed(0)}
                            {/* 價格為無條件捨取 */}
                          </div>
                        )}
                      </p>
                      <button className={`${styles['heart-btn']}`}>
                        <FaHeart
                          className={`${styles['heart']} ${
                            favorites[relatedProduct.id] ? styles['active'] : ''
                          }`}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleFavorite(relatedProduct.id)
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        <Footer />

        {showButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`${styles.gototop} btn`}
          >
            <FaAngleUp />
            <br /> Top
          </button>
        )}
      </div>
    </>
  )
}

/* SSR 部分 */
export async function getServerSideProps(context) {
  // 從 URL 取得 query 參數(給予預設值避免請求無效)
  const { pid } = context.params

  const [product_res, otherRes1, otherRes2] = await Promise.all([
    axios.get(`${process.env.NEXT_PUBLIC_BACK_API}/product/${pid}`),
  ])

  // 解構 data (axios 解構出來就是物件)

  return {
    props: {
      productRes: product_res.data.data, // 主要畫面
    },
  }
}
