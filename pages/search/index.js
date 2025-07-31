/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '@/styles/SearchResults.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { FaAngleLeft } from 'react-icons/fa6'
import { FaAngleRight } from 'react-icons/fa6'
import { FaAnglesLeft } from 'react-icons/fa6'
import { FaAnglesRight } from 'react-icons/fa6'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { PiCoffeeDuotone } from 'react-icons/pi'
import Loading from '@/components/Loading'
import { RiSearchEyeFill } from 'react-icons/ri'

function SearchResults() {
  const [activeTab, setActiveTab] = useState('products')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [counts, setCounts] = useState({ products: 0, courses: 0, articles: 0 })
  const [pagination, setPagination] = useState({
    products: { currentPage: 1, totalPages: 1 },
    courses: { currentPage: 1, totalPages: 1 },
    articles: { currentPage: 1, totalPages: 1 },
  })
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'products'
    setSearchQuery(query)
    setActiveTab(type)
    fetchResults(type, 1, query) // 添加 query 参数
  }, [])

  // 修改 fetchResults 函数，添加 query 参数
  const fetchResults = async (type, page, query) => {
    try {
      const response = await axios.get(
        `http://localhost:3005/api/search?q=${query}&type=${type}&page=${page}`
      )
      setResults(response.data.data[type])
      setCounts(response.data.counts)
      setPagination((prev) => ({
        ...prev,
        [type]: {
          currentPage: page,
          totalPages: response.data.data.totalPages,
        },
      }))
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
  }

  // 修改第二个 useEffect
  useEffect(() => {
    fetchResults(activeTab, pagination[activeTab].currentPage, searchQuery)
  }, [activeTab, pagination[activeTab].currentPage, searchQuery])

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        currentPage: page,
      },
    }))
  }
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPagination((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        currentPage: 1,
      },
    }))
  }

  const renderPagination = () => {
    const { currentPage, totalPages } = pagination[activeTab]
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + 4)

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }

    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <a
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? styles.selected : ''}
          href="#"
        >
          {i}
        </a>
      )
    }
    return pages
  }
  const renderProducts = () => (
    <div className={`row gx-5 ${styles['my-row']}`}>
      {results.map((product) => (
        <div
          key={product.id}
          className={`col-6 col-md-4 col-lg-3 ${styles['my-col']}`}
        >
          <a
            className={`${styles['overview-card']}`}
            href={`/product/${product.id}`}
          >
            <Image
              src={`http://localhost:3005/api/images/hello/${product.img}`}
              alt={product.name}
              width={100}
              height={100}
              onError={(e) => {
                e.target.src =
                  'http://localhost:3005/api/images/hello/bean-light-1.png'
              }}
            />
            <div className={`${styles['overview-down']}`}>
              <p className={`${styles['overview-title']}`}>{product.name}</p>
            </div>
            <div className={`d-flex ${styles['overview-bottomm']}`}>
              <div
                className={`${styles['front-price']} ${
                  product.discount !== 1 ? styles['has-discount'] : ''
                }`}
              >
                ${product.price}
              </div>
              {product.discount !== 1 && (
                <div className={`${styles['off-price']}`}>
                  ${(product.price * product.discount).toFixed(0)}
                </div>
              )}
            </div>
          </a>
        </div>
      ))}
    </div>
  )

  const renderCourses = () => (
    <div className="row">
      {results.map((course) => (
        <div key={course.id} className="col-6 col-md-4 col-lg-3">
          <a href={`/course/${course.id}`} className={styles.helloo}>
            <div className={styles.cmainCard}>
              <div className={styles.cmcImg}>
                <Image
                  src={`http://localhost:3005/api/images/course/${course.img_main}`}
                  alt={course.name}
                  width={300}
                  height={300}
                />
              </div>
              <div className={styles.cmcCon}>
                <div className={styles.cmcName}>{course.name}</div>
                <div className={styles.cmcP}>
                  $
                  <span>
                    {course.price ? course.price.toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  )

  const renderArticles = () => (
    <div className={`${styles['container']} ${styles['card-group']} container`}>
      <div
        className={`${styles['row']} row row-cols-1 row-cols-sm-2 row-cols-md-3`}
      >
        {results.map((article) => (
          <div key={article.id} className={`${styles['col']}`}>
            <div
              key={article.id}
              className={`${styles['card']} ${styles['card1']}`}
            >
              <div className={styles['card-image']}>
                {article.image_url && (
                  <Image
                    alt={article.title}
                    width={1000}
                    height={600}
                    className={`${styles['card-image']} img-fluid rounded-start`}
                    src={`http://localhost:3005${article.image_url}`}
                  />
                )}
              </div>
              <div className={`${styles['card-body']}`}>
                <div className={`${styles['tag-group']}`}>
                  <p className={`${styles['tag']} ${styles['tag1']}`}>
                    {article.tag1}
                  </p>
                  <p className={`${styles['tag']} ${styles['tag2']}`}>
                    {article.tag2}
                  </p>
                </div>
                <div className={styles['publish-date']}>
                  {new Date(article.create_time).toLocaleDateString()}
                </div>
                <div className={styles['title-group']}>
                  <p className={styles['card-title']}>{article.title}</p>
                  <div className={styles['title-border']} />
                </div>
                <p className={styles['card-text']}>
                  <div
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    className={styles['article-content']}
                  />
                </p>
                <div className={styles['btn-box']}>
                  <Link
                    className={styles['btn-more']}
                    href={`/article/${article.id}`}
                  >
                    READ MORE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className={`container-fluid ${styles.backg} p-0 mt-5`}>
      <Header />
      <div className={`container mt-5 ${styles['searchResults']}`}>
        <h2>
          <RiSearchEyeFill className={`me-3 ${styles['coffeeIcon']}`} />
          搜尋 "{searchQuery}" 結果
        </h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === 'products' ? styles.active : ''
            }`}
            onClick={() => handleTabChange('products')}
          >
            商品 ({counts.products})
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === 'courses' ? styles.active : ''
            }`}
            onClick={() => handleTabChange('courses')}
          >
            課程 ({counts.courses})
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === 'articles' ? styles.active : ''
            }`}
            onClick={() => handleTabChange('articles')}
          >
            文章 ({counts.articles})
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {activeTab === 'products' &&
              counts.products > 0 &&
              renderProducts()}
            {activeTab === 'courses' && counts.courses > 0 && renderCourses()}
            {activeTab === 'articles' &&
              counts.articles > 0 &&
              renderArticles()}
            <div className={`${styles['pagination']}`}>
              <a
                onClick={() => handlePageChange(1)}
                className={
                  pagination[activeTab].currentPage === 1 ? styles.disabled : ''
                }
                href="#"
              >
                <FaAnglesLeft />
              </a>
              <a
                onClick={() =>
                  handlePageChange(pagination[activeTab].currentPage - 1)
                }
                className={
                  pagination[activeTab].currentPage === 1 ? styles.disabled : ''
                }
                href="#"
              >
                <FaAngleLeft />
              </a>
              {renderPagination()}
              <a
                onClick={() =>
                  handlePageChange(pagination[activeTab].currentPage + 1)
                }
                className={
                  pagination[activeTab].currentPage ===
                  pagination[activeTab].totalPages
                    ? styles.disabled
                    : ''
                }
                href="#"
              >
                <FaAngleRight />
              </a>
              <a
                onClick={() =>
                  handlePageChange(pagination[activeTab].totalPages)
                }
                className={
                  pagination[activeTab].currentPage ===
                  pagination[activeTab].totalPages
                    ? styles.disabled
                    : ''
                }
                href="#"
              >
                <FaAnglesRight />
              </a>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default SearchResults
