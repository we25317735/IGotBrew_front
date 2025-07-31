import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaPlus, FaPencilAlt, FaEye, FaTrashAlt } from 'react-icons/fa'
import { Modal, Button, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import styles from '@/styles/pe.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import Loading from '@/components/Loading'
import BackSelect from '@/components/backSelect'

// .env 檔案載入(共用api部分)
import 'dotenv/config.js'

export default function ProductManager() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState({})
  const [filter, setFilter] = useState({ status: '', category: '', sort: '' })
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [currentPage, filter])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3005/api/product/admin/products',
        {
          params: {
            page: currentPage,
            ...filter,
          },
        }
      )
      setProducts(response.data.products)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_API}/product/admin/categories`
      )
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAddProduct = async (productData) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_API}/product/admin/products`,
        productData
      )
      fetchProducts()
      setShowAddModal(false)
      Swal.fire({
        title: 'Success',
        text: '成功新增',
        icon: 'success',
        confirmButtonText: '確定',
        confirmButtonColor: '#2b4f61',
      })
    } catch (error) {
      console.error('Error adding product:', error)
      Swal.fire('Error', '新增商品失敗', 'error')
    }
  }

  const handleEditProduct = async (productData) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_API}/product/admin/products/${currentProduct.id}`,
        productData
      )
      fetchProducts()
      setShowEditModal(false)
      Swal.fire({
        title: 'Success',
        text: '成功更新',
        icon: 'success',
        confirmButtonText: '確定',
        confirmButtonColor: '#2b4f61',
      })
    } catch (error) {
      console.error('Error updating product:', error)
      Swal.fire('Error', '更新失敗', 'error')
    }
  }
  const handleClick = () => {
    router.reload() // 重新加載當前頁面
  }

  // 刪除項目
  const handleDeleteProduct = async (productId) => {
    try {
      const result = await Swal.fire({
        title: '確定要刪除嗎？',
        text: '刪除後不能復原喔',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#d2d2d2',
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
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
      })

      if (result.isConfirmed) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACK_API}/product/admin/products/${productId}`
        )
        fetchProducts()
        Swal.fire({
          title: '刪除',
          text: '已經成功刪除了',
          icon: 'success',
          confirmButtonText: '確定',
          confirmButtonColor: '#2b4f61',
        })
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      Swal.fire('Error', '刪除失敗，請洽維修人員', 'error')
    }
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={currentPage === i ? styles.activePage : ''}
        >
          {i}
        </button>
      )
    }
    return pages
  }
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  return (
    <div className={`container-fluid ${styles.backg} mt-3`}>
      {/* <Header /> */}
      <BackSelect />
      <div className={`container ${styles['productManager']} mt-5`}>
        <Link
          href="/productEditor"
          className={`${styles['titlee']}`}
          onClick={handleClick}
          style={{ textAlign: 'center', fontWeight: '700', fontSize: '3.5rem' }}
        >
          <p>IGorBrew 商品後台管理</p>
        </Link>

        <div className={styles.controls}>
          <button
            onClick={() => setShowAddModal(true)}
            className={styles.addButton}
          >
            <FaPlus /> 新增商品
          </button>
          <select
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            value={filter.status}
          >
            <option value="">全部商品</option>
            <option value="1">已上架</option>
            <option value="0">未上架</option>
          </select>
          <select
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            value={filter.category}
          >
            <option value="">全部類別</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
            value={filter.sort}
          >
            <option value="">排序方式</option>
            <option value="id_asc">ID 升序</option>
            <option value="id_desc">ID 降序</option>
          </select>
        </div>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th>折扣後價格</th>
              <th>庫存量</th>
              <th>上架時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>${(product.price * product.discount).toFixed(0)}</td>
                <td className={product.stock < 10 ? styles.lowStock : ''}>
                  {product.stock}
                </td>
                <td>{new Date(product.ontime).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => {
                        setCurrentProduct(product)
                        setShowEditModal(true)
                      }}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentProduct(product)
                        setShowViewModal(true)
                      }}
                    >
                      <FaEye />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>{renderPagination()}</div>
        <ProductModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          handleSubmit={handleAddProduct}
          product={{}}
          categories={categories}
          mode="add"
        />

        <ProductModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          handleSubmit={handleEditProduct}
          product={currentProduct}
          categories={categories}
          mode="edit"
        />
        <ViewModal
          show={showViewModal}
          handleClose={() => setShowViewModal(false)}
          product={currentProduct}
        />
      </div>
    </div>
  )
}

function ProductModal({
  show,
  handleClose: parentHandleClose,
  handleSubmit,
  product,
  categories,
  mode,
}) {
  const [formData, setFormData] = useState(mode === 'edit' ? product : {})
  const [detailImgs, setDetailImgs] = useState(product.detailImgs || [])
  const [detailImgPreviews, setDetailImgPreviews] = useState([])
  const [isNewImageSelected, setIsNewImageSelected] = useState(false)
  const handleQuickFill = () => {
    const now = new Date().toISOString().slice(0, 16)
    setFormData({
      ...formData,
      name: 'KIMBO淺烘焙咖啡豆',
      category_id: categories.find((c) => c.name === '淺中焙')?.id || '',
      price: 2000,
      discount: 1,
      stock: 34,
      status: 1,
      ontime: now,
    })
  }

  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({ ...product, id: product.id })
    } else {
      setFormData({})
    }
  }, [product, mode])

  useEffect(() => {
    // 生成詳細圖片預覽 URL
    const previews = detailImgs
      .filter((img) => img instanceof File)
      .map((img) => URL.createObjectURL(img))
    setDetailImgPreviews(previews)

    // 清理預覽 URL
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [detailImgs])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleDetailImgChange = (e) => {
    const files = Array.from(e.target.files).filter(
      (file) => file instanceof File
    )
    if (files.length + detailImgs.length > 3) {
      alert('只能上传最多三张图片')
      return
    }
    setDetailImgs([...detailImgs, ...files])
  }

  const removeDetailImg = (index) => {
    const newDetailImgs = [...detailImgs]
    newDetailImgs.splice(index, 1)
    setDetailImgs(newDetailImgs)
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    setFormData({
      ...formData,
      img: file,
    })
    setIsNewImageSelected(true)
  }

  const handleClose = () => {
    parentHandleClose()
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    setDetailImgPreviews([])
    if (mode === 'edit') {
      if (!formData.id) {
        console.error('Product ID is missing')
        return
      }
      data.append('id', formData.id)
    }

    for (let key in formData) {
      data.append(key, formData[key])
    }
    detailImgs.forEach((img, index) => {
      if (img instanceof File) {
        data.append('detail_imgs', img)
      } else {
        data.append('existing_detail_imgs', img)
      }
    })

    handleSubmit(data)
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'add' ? '新增商品' : '編輯商品'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <div className="position-relative mb-3">
            <Button
              variant="link"
              className="position-absolute top-0 end-0 p-0"
              style={{ opacity: 0.1 }}
              onClick={handleQuickFill}
            >
              Quick Fill
            </Button>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <Form.Group>
                <Form.Label>商品名稱</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>
          {mode === 'edit' && product.img && (
            <>
              <div className="row mb-3">
                <div className="col-3">
                  <p>原始圖片</p>
                  <Image
                    src={`http://localhost:3005/api/images/hello/${product.img}`}
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>
                <div className="col-9">
                  <p>原始詳細圖片</p>
                  <div className="d-flex flex-wrap gap-2">
                    {product.detailImgs &&
                      product.detailImgs.map((img, index) => (
                        <div key={index} className="mr-2 mb-2">
                          <Image
                            src={`http://localhost:3005/api/images/detail-img/${img}`}
                            alt={`Detail ${index + 1}`}
                            width={100}
                            height={100}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>類別</Form.Label>
                <Form.Control
                  as="select"
                  name="category_id"
                  value={formData.category_id || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">選擇類別</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>價格</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>折扣</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="discount"
                  value={formData.discount || ''}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>庫存</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock || ''}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <Form.Group>
                <Form.Label>商品內容</Form.Label>
                <Form.Control
                  as="textarea"
                  name="content"
                  value={formData.content || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Check
                  type="radio"
                  label="上架"
                  name="status"
                  checked={formData.status === 1 || formData.status === true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        status: 1, // 設置 status 為 1 或 true
                      })
                    }
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Check
                  type="radio"
                  label="下架"
                  name="status"
                  checked={formData.status === 0 || formData.status === false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        status: 0, // 設置 status 為 0 或 false
                      })
                    }
                  }}
                />
              </Form.Group>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>上架時間</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="ontime"
                  value={formData.ontime ? formData.ontime.slice(0, 16) : ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>下架時間</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="offtime"
                  value={formData.offtime ? formData.offtime.slice(0, 16) : ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>更換主圖</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {isNewImageSelected && formData.img instanceof File && (
                  <Image
                    src={URL.createObjectURL(formData.img)}
                    alt="Main Image Preview"
                    width={100}
                    height={100}
                    className="mt-2"
                  />
                )}
              </Form.Group>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12">
              <Form.Group>
                <Form.Label>更換詳細圖片</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDetailImgChange}
                />
                <div className="d-flex flex-wrap mt-2">
                  {detailImgPreviews.map((preview, index) => (
                    <div key={index} className="position-relative mr-2 mb-2">
                      <Image
                        src={preview}
                        alt={`Detail Preview ${index + 1}`}
                        width={100}
                        height={100}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0"
                        onClick={() => removeDetailImg(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose}>
              取消
            </Button>
            {mode === 'add' ? (
              <Button type="submit" variant="primary">
                新增
              </Button>
            ) : (
              <Button type="submit" variant="primary">
                更新
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

function ViewModal({ show, handleClose, product }) {
  const [enlargedImg, setEnlargedImg] = useState(null)

  const handleImageClick = (img, isMain = false) => {
    setEnlargedImg({ img, isMain })
  }

  const handleEnlargedClose = () => {
    setEnlargedImg(null)
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>商品詳情</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.viewImages}>
            <h5>主要圖片</h5>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${product.img}`}
              alt=""
              width={100}
              height={100}
              onClick={() => handleImageClick(product.img, true)}
              className={styles.clickableImage}
            />
            <h5 className="mt-3">詳細圖片</h5>
            <div className="d-flex flex-wrap gap-2">
              {product.detailImgs &&
                product.detailImgs.map((img, index) => (
                  <div key={index} className="mr-2 mb-2">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/detail-img/${img}`}
                      alt={`Detail ${index + 1}`}
                      width={100}
                      height={100}
                      onClick={() => handleImageClick(img)}
                      className={styles.clickableImage}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className={styles.productDetails}>
            <p>
              <strong>商品名稱:</strong> {product.name}
            </p>
            <p>
              <strong>商品內容:</strong> {product.content}
            </p>
            <div className={styles.column}>
              <p>
                <strong>類別:</strong> {product.category_name}
              </p>
              <p>
                <strong>價格:</strong> {product.price}
              </p>
            </div>
            <div className={styles.column}>
              <p>
                <strong>折扣:</strong> {product.discount}
              </p>
              <p>
                <strong>狀態:</strong> {product.status ? '上架' : '下架'}
              </p>
            </div>
            <div className={styles.column}>
              <p>
                <strong>庫存:</strong> {product.stock}
              </p>
              <p>
                <strong>加入特賣:</strong> {product.special ? '是' : '否'}
              </p>
            </div>
            <div className={styles.column}>
              <p>
                <strong>上架時間:</strong> {product.ontime}
              </p>
              <p>
                <strong>下架時間:</strong> {product.offtime}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 放大圖片的模態窗口 */}
      <Modal show={!!enlargedImg} onHide={handleEnlargedClose} centered>
        <Modal.Body className="d-flex justify-content-center">
          {enlargedImg && (
            <Image
              src={
                enlargedImg.isMain
                  ? `${process.env.NEXT_PUBLIC_BACK_IMG}/images/hello/${enlargedImg.img}`
                  : `${process.env.NEXT_PUBLIC_BACK_IMG}/images/detail-img/${enlargedImg.img}`
              }
              alt="Enlarged"
              width={500}
              height={500}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEnlargedClose}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
