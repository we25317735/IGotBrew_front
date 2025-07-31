import React, { useEffect, useState } from 'react'
import styles from '@/styles/article.module.scss'
import Image from 'next/image'
import api from '@/services/articleApi'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

import newhand from '@/public/images/article/newhand.png'
import oldhand from '@/public/images/article/oldhand.png'
import coffeebean from '@/public/images/article/coffeebean.png'
import coffeemachine from '@/public/images/article/coffeemachine.png'
import tools from '@/public/images/article/tools.png'
import { FaAngleLeft } from 'react-icons/fa6'
import { FaAngleRight } from 'react-icons/fa6'

// .env 檔案載入(共用api部分)
import 'dotenv/config.js'

export default function Article() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc')
  const articlesPerPage = 9

  useEffect(() => {
    const fetchArticlesWithLikes = async () => {
      try {
        const response = await api.getAllArticles()
        const articles = response.data.articles

        const articlesWithLikes = await Promise.all(
          articles.map(async (article) => {
            const likesData = await api.getArticleLikes(article.id)
            return { ...article, likes_count: likesData.likes_count || 0 }
          })
        )

        let sortedArticles
        if (sortOrder === 'likes') {
          sortedArticles = articlesWithLikes.sort(
            (a, b) => b.likes_count - a.likes_count
          )
        } else {
          sortedArticles = articlesWithLikes.sort((a, b) =>
            sortOrder === 'asc' ? a.id - b.id : b.id - a.id
          )
        }
        setArticles(sortedArticles)
      } catch (error) {
        console.error('Failed to fetch articles:', error.message)
      }
    }

    fetchArticlesWithLikes()
  }, [sortOrder])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSortChange = (e) => {
    if (e.target.checked) {
      setSortOrder('likes')
    } else {
      setSortOrder('desc')
    }
  }

  const handleTagClick = (tag) => {
    setSelectedTag(tag)
    setCurrentPage(1)
  }

  const filteredArticles = selectedTag
    ? articles.filter(
        (article) =>
          article.tag1 === selectedTag || article.tag2 === selectedTag
      )
    : articles

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  )
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    const element = document.getElementById('filter')
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className={`${styles['articles-bg']} container-fluid mt-5`}>
        <div className={`${styles['articles']}`}>
          <div className={`${styles['container-title']} container`}>
            <div className={`${styles['title']}`}>
              <p>咖啡專欄</p>
            </div>
            <nav
              aria-label="breadcrumb"
              className={`${styles['article-breadcrumb']}`}
              style={{
                '--bs-breadcrumb-divider': "'>'",
              }}
            >
              <ol className="breadcrumb">
                <li className={`${styles['breadcrumb-item']} breadcrumb-item`}>
                  <Link href="/IGotBrew">首頁</Link>
                </li>
                <li
                  aria-current="page"
                  className={`${styles['breadcrumb-item']} ${styles['active']} breadcrumb-item active`}
                >
                  咖啡專欄
                </li>
              </ol>
            </nav>
          </div>
          <div
            className={`${styles['container']} ${styles['tag-group']} container`}
          >
            <div className={`${styles['row']} row row-cols-md-5 row-cols-lg-5`}>
              <div
                className={`${styles['tag1']} ${styles['tag-fliter']} ${styles['col-6']} col col-6`}
                onClick={() => handleTagClick('新手')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTagClick('新手')
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className={`${styles['tag-col']} col`}>
                  <Image
                    className={`${styles['tag-pic']}`}
                    layout="responsive"
                    alt=""
                    src={newhand}
                  />
                  <div className={styles['tag-name']}>
                    <p># 新手</p>
                  </div>
                </div>
              </div>
              <div
                className={`${styles['tag2']} ${styles['tag-fliter']} ${styles['col-6']} col col-6`}
                onClick={() => handleTagClick('老手')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTagClick('老手')
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className={styles['tag-col']}>
                  <Image
                    className={`${styles['tag-pic']}`}
                    layout="responsive"
                    alt=""
                    src={oldhand}
                  />
                  <div className={styles['tag-name']}>
                    <p># 老手</p>
                  </div>
                </div>
              </div>
              <div
                className={`${styles['tag3']} ${styles['tag-fliter']} ${styles['col']} col col-4`}
                onClick={() => handleTagClick('咖啡豆')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTagClick('咖啡豆')
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className={styles['tag-col']}>
                  <Image
                    className={`${styles['tag-pic']}`}
                    layout="responsive"
                    alt=""
                    src={coffeebean}
                  />
                  <div className={styles['tag-name']}>
                    <p># 咖啡豆</p>
                  </div>
                </div>
              </div>
              <div
                className={`${styles['tag4']} ${styles['tag-fliter']} ${styles['col']} col col-4`}
                onClick={() => handleTagClick('咖啡機')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTagClick('咖啡機')
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className={styles['tag-col']}>
                  <Image
                    className={`${styles['tag-pic']}`}
                    layout="responsive"
                    alt=""
                    src={coffeemachine}
                  />
                  <div className={styles['tag-name']}>
                    <p># 咖啡機</p>
                  </div>
                </div>
              </div>
              <div
                className={`${styles['tag5']} ${styles['tag-fliter']} ${styles['col-4']} col col-4`}
                onClick={() => handleTagClick('配件')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTagClick('配件')
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className={styles['tag-col']}>
                  <Image
                    className={`${styles['tag-pic']}`}
                    layout="responsive"
                    alt=""
                    src={tools}
                  />
                  <div className={styles['tag-name']}>
                    <p># 配件</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="filter"
            className={`${styles['total-fliter']} container d-flex`}
          >
            <div className={`${styles['count']}`}>
              <p>共&nbsp;{filteredArticles.length}&nbsp;筆</p>
            </div>
            <div className={`${styles['filter']}`}>
              <div className={`${styles['switch']}`}>
                <input
                  className={`${styles['check-toggle']} ${styles['checkFilter']}`}
                  id="toggle"
                  type="checkbox"
                  onChange={handleSortChange}
                />
                <label htmlFor="toggle"></label>
                <span className={`${styles['on']}`}>最新知識</span>
                <span className={`${styles['off']}`}>最多按讚</span>
              </div>
            </div>
          </div>

          <div
            className={`${styles['container']} ${styles['card-group']} container`}
          >
            <div
              className={`${styles['row']} ${styles['row-cols-1']} ${styles['row-cols-sm-2']} ${styles['row-cols-md-3']} row row-cols-1 row-cols-sm-2 row-cols-md-3`}
            >
              {currentArticles.map((article) => (
                <div key={article.id} className={`${styles['col']}`}>
                  <div className={`${styles['card']} ${styles['card1']}`}>
                    <div className={styles['card-image']}>
                      {article.image_url && (
                        <Image
                          alt={article.title}
                          width={1000}
                          height={600}
                          className={`${styles['card-image']} img-fluid rounded-start`}
                          src={`${process.env.NEXT_PUBLIC_BACK_IMG}${article.image_url}`}
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
                        {' '}
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
          <div className={`${styles['pagination']} container`}>
            <nav aria-label="Page navigation example">
              <ul
                className={`${styles['pagination']} pagination justify-content-center`}
              >
                <li
                  className={`${styles['page-item']} page-item ${
                    currentPage === 1 ? 'disabled' : ''
                  }`}
                >
                  <button
                    className={`${styles['page-link']} page-link`}
                    onClick={(e) => {
                      e.preventDefault()
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }}
                    aria-label="Previous"
                  >
                    <span aria-hidden="true">
                      <FaAngleLeft />
                    </span>
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`${styles['page-item']} page-item ${
                      currentPage === index + 1 ? styles.active : ''
                    }`}
                  >
                    <button
                      className={`${styles['page-link']} page-link`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`${styles['page-item']} page-item ${
                    currentPage === totalPages ? 'disabled' : ''
                  }`}
                >
                  <button
                    className={`${styles['page-link']} page-link`}
                    onClick={(e) => {
                      e.preventDefault()
                      currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                    }}
                    aria-label="Next"
                  >
                    <span aria-hidden="true">
                      <FaAngleRight />
                    </span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
