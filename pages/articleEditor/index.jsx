import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/articleEditor.module.sass'
import api from '@/services/articleApi'
import Loading from '@/components/Loading'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { FaEye } from 'react-icons/fa6'
import { ImPencil2 } from 'react-icons/im'
import { FiFilePlus } from 'react-icons/fi'
import { FaSortNumericDown } from 'react-icons/fa'
import { FaSortNumericUp } from 'react-icons/fa'
import { LuSearch } from 'react-icons/lu'
import { FaAngleLeft } from 'react-icons/fa6'
import { FaAngleRight } from 'react-icons/fa6'
import Header from '@/components/Header'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import BackSelect from '@/components/backSelect'

const ArticlesList = () => {
  const [articles, setArticles] = useState([])
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const MySwal = withReactContent(Swal)
  const articlesPerPage = 5

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let response
        if (searchKeyword) {
          response = await api.searchArticles(searchKeyword)
        } else {
          response = await api.getAllArticles()
        }
        console.log('Fetched raw data:', response.data)

        const articles = response.data.articles
        console.log('Articles returned by API:', articles)

        const filteredArticles = articles.sort((a, b) =>
          sortOrder === 'asc' ? a.id - b.id : b.id - a.id
        )

        console.log('Filtered articles:', filteredArticles)
        setArticles(filteredArticles)
      } catch (error) {
        console.error('Failed to fetch articles:', error.message)
      }
    }

    fetchArticles()
  }, [sortOrder, searchKeyword])

  useEffect(() => {
    console.log('Articles state updated:', articles)
  }, [articles])

  const handleDelete = async (id) => {
    try {
      const result = await MySwal.fire({
        title: '你確定要刪除這篇文章嗎？',
        text: '此操作將無法恢復！',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確定',
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
      })

      if (result.isConfirmed) {
        await api.deleteArticle(id)

        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.id !== id)
        )

        MySwal.fire({
          icon: 'success',
          title: '已刪除',
          text: '這篇文章已成功刪除',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2b4f61',
          customClass: {
            confirmButton: 'swal2-confirm-custom',
          },
          didOpen: () => {
            const confirmBtn = document.querySelector('.swal2-confirm-custom')

            if (confirmBtn) {
              confirmBtn.style.fontSize = '16px'
              confirmBtn.style.padding = '7px 18px'
            }
          },
        })
      }
    } catch (error) {
      console.error('Failed to delete article:', error.message)
      MySwal.fire({
        icon: 'error',
        title: '刪除失敗！',
        text: '刪除文章時發生錯誤，請稍後再試。',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2b4f61',
        customClass: {
          confirmButton: 'swal2-confirm-custom',
        },
        didOpen: () => {
          const confirmBtn = document.querySelector('.swal2-confirm-custom')

          if (confirmBtn) {
            confirmBtn.style.fontSize = '16px'
            confirmBtn.style.padding = '7px 18px'
          }
        },
      })
    }
  }

  const handleSortAsc = () => {
    setSortOrder('asc')
  }

  const handleSortDesc = () => {
    setSortOrder('desc')
  }

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  )

  const totalPages = Math.ceil(articles.length / articlesPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleSearch = () => {
    setCurrentPage(1)
    setSearchKeyword(searchKeyword)
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
      <BackSelect />
      <Head>
        <title>文章列表</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.bg} container-fluid`}>
        <div className="container">
          <div className="text-center mt-5">
            <div className={`${styles.title}`}>文章列表</div>
            <div className="d-flex justify-content-center align-content-center mb-5 mt-5">
              <div className="container-fluid my-auto ">
                <div class={`${styles['search-input']} input-group`}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon1"
                  >
                    <LuSearch />
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    aria-label="Example text with button addon"
                    aria-describedby="button-addon1"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }
                    }}
                  />
                </div>
              </div>
              <div className="container-fluid d-flex my-auto justify-content-end aligin-content-center">
                <Link
                  href="/articleEditor/publish"
                  className={`${styles['publish-btn']} ms-2`}
                >
                  <FiFilePlus />
                </Link>
                <button
                  onClick={handleSortAsc}
                  className={`${styles['asc-btn']} ms-2 `}
                >
                  <FaSortNumericDown />
                </button>
                <button
                  onClick={handleSortDesc}
                  className={`${styles['desc-btn']}`}
                >
                  <FaSortNumericUp />
                </button>
              </div>
            </div>
          </div>

          <div className={`${styles['count']} mb-4`}>
            <p>共&nbsp;{articles.length}&nbsp;筆</p>
          </div>

          <div>
            {currentArticles.map((article) => (
              <div key={article.id} className="card col-mb-8 mb-3 mx-auto">
                <div className="row row-cols-2 g-0">
                  <div className="col-md-5">
                    <div className={`${styles['image-wrapper']}`}>
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
                  </div>
                  <div className="col-md-7 d-flex align-items-center">
                    <div className={`${styles['card-body']} card-body`}>
                      <h5 className={`${styles['card-title']} card-title mt-5`}>
                        {article.title}
                      </h5>
                      <div
                        className={`${styles['tag-group']} card-subtitle d-flex mb-2`}
                      >
                        <div className={`${styles['tag1']}`}>
                          {article.tag1}
                        </div>
                        <div className={`${styles['tag2']}`}>
                          {article.tag2}
                        </div>
                      </div>
                      <p className={`${styles['card-text']} card-text`}>
                        {new Date(article.create_time).toLocaleDateString()}
                      </p>
                      <div className={`${styles['button-group']}`}>
                        <div className="d-flex justify-content-end pe-2">
                          <Link
                            className={`${styles['btn-more']} btn m-2`}
                            href={`/articleEditor/${article.id}`}
                          >
                            <FaEye />
                          </Link>
                          <Link
                            href={`/articleEditor/${article.id}/edit`}
                            className={`${styles['btn-edit']} btn m-2`}
                          >
                            <ImPencil2 />
                          </Link>
                          <button
                            className={`${styles['btn-delete']} btn m-2`}
                            onClick={() => handleDelete(article.id)}
                          >
                            <RiDeleteBin5Fill />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`${styles['pagination']} container mt-5 mb-5`}>
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
      </main>
    </>
  )
}

export default ArticlesList
