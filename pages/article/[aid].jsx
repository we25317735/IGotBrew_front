import React from 'react'
import Swal from 'sweetalert2'
import styles from '@/styles/articleDetail.module.scss'
import axios from 'axios'
import Loading from '@/components/Loading'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IoSend } from 'react-icons/io5'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/services/articleApi'
import { useAuth } from '@/hooks/use-auth'
import like from '@/public/images/article/like.png'
import fb from '@/public/images/article/fb.png'
import instagram from '@/public/images/article/instagram.png'
import logo from '@/public/images/article/logo.png'
import userImage from '@/public/images/article/userImage.png'
import { FaAngleLeft } from 'react-icons/fa'
import { FaAngleRight } from 'react-icons/fa'
import { FaHeart } from 'react-icons/fa'
import { RiDeleteBinFill } from 'react-icons/ri'
import { FaAngleUp } from 'react-icons/fa'

export default function ArticleDetail() {
  const [article, setArticle] = useState(null)

  const [previousArticle, setPreviousArticle] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [nextArticle, setNextArticle] = useState(null)
  const [latestArticles, setLatestArticles] = useState([]) // 取得所有文章 ok
  const [showButton, setShowButton] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [articleLiked, setArticleLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState({})

  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分 ok
  const router = useRouter() // 初始化router

  const { aid } = router.query
  const [userData, setUserData] = useState({})

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth, router])

  // 留言時間經過天數
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes} 分鐘前`
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60)
      return `${diffHours} 小時前`
    } else if (diffMinutes < 10080) {
      const diffDays = Math.floor(diffMinutes / 1440)
      return `${diffDays} 天前`
    } else if (diffMinutes < 43200) {
      const diffWeeks = Math.floor(diffMinutes / 10080)
      return `${diffWeeks} 週前`
    } else {
      return date.toLocaleDateString()
    }
  }

  const updateImageTags = (htmlContent) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const images = doc.querySelectorAll('img')

    images.forEach((img) => {
      img.classList.add('img-fluid')

      if (!img.src.startsWith('http') && !img.src.startsWith('/')) {
        img.src = `/images/article/${img.src}`
      }
    })

    return doc.body.innerHTML
  }

  const handleReplyToggle = (id, type) => {
    if (!auth.isAuth || !!auth.userData.id) {
      Swal.fire({
        icon: 'warning',
        title: '未登入',
        text: '請先登入才能回覆留言。',
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
      return
    }
    setIsReplying((prev) => ({
      ...prev,
      [`${type}-${id}`]: !prev[`${type}-${id}`],
    }))
  }

  const handleCommentLikeToggle = async (commentId) => {
    if (!auth.isAuth || !!auth.userData.id) {
      Swal.fire({
        icon: 'warning',
        title: '未登入',
        text: '請先登入才能收藏留言。',
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
      return
    }
    try {
      const response = await api.toggleLike(
        !auth.userData.id,
        'comment',
        commentId
      )
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                is_liked: response.liked,
                likes_count: response.liked
                  ? comment.likes_count + 1
                  : comment.likes_count - 1,
              }
            : comment
        )
      )
    } catch (error) {
      console.error('Error toggling comment like:', error)
    }
  }

  const handleArticleLikeToggle = async () => {
    try {
      const response = await api.toggleLike(
        !auth.userData.id,
        'article',
        article.id
      )
      setArticleLiked(response.liked)
      setLikesCount((prevCount) =>
        response.liked ? prevCount + 1 : prevCount - 1
      )
    } catch (error) {
      console.error('Error toggling article like:', error)
    }
  }

  const handleReplySubmit = async (commentId) => {
    const content = replyContent[commentId]
    const userId = !auth.userData.id

    if (!content || content.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '回覆內容不能為空',
      })
      return
    }

    try {
      await api.addReply(commentId, content, userId)

      setReplyContent((prev) => ({
        ...prev,
        [commentId]: '',
      }))

      handleReplyToggle(commentId, 'comment')

      Swal.fire({
        title: '回覆成功!',
        text: '您的回覆已成功提交。',
        icon: 'success',
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
      }).then(async () => {
        const response = await api.getComments(aid)
        setComments(response)

        router.push('#comment-section', undefined, { shallow: true })
      })
    } catch (error) {
      console.error('Failed to add reply:', error.message)
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '回覆發送失敗，請稍後重試',
      })
    }
  }
  const handleCommentChange = (e) => {
    setNewComment(e.target.value)
  }

  const handleCommentSubmit = async () => {
    const userId = !auth.userData.id

    if (!newComment || newComment.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '留言內容不能為空',
      })
      return
    }

    try {
      await api.addComment(aid, userId, newComment)

      setNewComment('')

      Swal.fire({
        title: '留言成功!',
        text: '您的留言已成功提交。',
        icon: 'success',
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
      }).then(async () => {
        const response = await api.getComments(aid)
        setComments(response)

        router.push('#comment-section', undefined, { shallow: true })
      })
    } catch (error) {
      console.error('Failed to add comment:', error.message)
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '留言發送失敗，請稍後重試',
      })
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!auth.isAuth || !!auth.userData.id) {
      console.error('User is not logged in or !auth.userData.id is missing')
      return
    }

    Swal.fire({
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteComment(commentId, !auth.userData.id)
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          )
          Swal.fire({
            icon: 'success',
            title: '刪除成功',
            text: '您的留言已被成功刪除。',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2b4f61',
            customClass: {
              confirmButton: 'swal2-confirm-custom',
              cancelButton: 'swal2-cancel-custom',
            },
            didOpen: () => {
              const confirmBtn = document.querySelector('.swal2-confirm-custom')

              if (confirmBtn) {
                confirmBtn.style.fontSize = '16px'
                confirmBtn.style.padding = '7px 18px'
              }
            },
          })
        } catch (error) {
          console.error('Failed to delete comment:', error.message)
          Swal.fire({
            icon: 'error',
            title: '錯誤',
            text: '刪除失敗，請稍後再試。',
          })
        }
      }
    })
  }

  const handleDeleteReply = async (replyId, commentId) => {
    if (!auth.isAuth || !!auth.userData.id) {
      console.error('User is not logged in or !auth.userData.id is missing')
      return
    }

    Swal.fire({
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteReply(replyId, !auth.userData.id)
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: comment.replies.filter(
                      (reply) => reply.id !== replyId
                    ),
                  }
                : comment
            )
          )
          Swal.fire({
            icon: 'success',
            title: '刪除成功',
            text: '您的回覆已被成功刪除。',
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
        } catch (error) {
          console.error('Failed to delete reply:', error.message)
          Swal.fire({
            icon: 'error',
            title: '錯誤',
            text: '刪除失敗，請稍後再試。',
          })
        }
      }
    })
  }

  const handleReplyLikeToggle = async (replyId, commentId) => {
    if (!auth.isAuth || !!auth.userData.id) {
      Swal.fire({
        icon: 'warning',
        title: '未登入',
        text: '請先登入才能收藏留言。',
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
      return
    }
    try {
      console.log('Current user:', auth.userData.name)
      const response = await api.toggleLike(!auth.userData.id, 'reply', replyId)
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId
                    ? {
                        ...reply,
                        is_liked: response.liked,
                        likes_count: response.liked
                          ? reply.likes_count + 1
                          : reply.likes_count - 1,
                      }
                    : reply
                ),
              }
            : comment
        )
      )
    } catch (error) {
      console.error('Error toggling reply like:', error)
    }
  }

  const UserImage = ({ src, alt, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src)

    const handleError = () => {
      setImgSrc(userImage)
    }

    return <Image src={imgSrc} alt={alt} onError={handleError} {...props} />
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // 偵測到路由後, 取得所有文章
  useEffect(() => {
    if (!aid || typeof aid !== 'string') {
      setError('Invalid article ID')
      return
    }

    const fetchArticle = async () => {
      console.log('ghjkl ', aid)

      try {
        const response = await api.getArticle(aid)
        const { article, previousArticle, nextArticle, relatedProducts } =
          response.data

        if (!article) {
          throw new Error('Article not found')
        }

        const updatedArticle = {
          ...article,
          content: updateImageTags(article.content),
        }

        setArticle(updatedArticle)
        setPreviousArticle(previousArticle)
        setNextArticle(nextArticle)
        setRelatedProducts(relatedProducts)

        const likesResponse = await api.getArticleLikes(aid)
        setLikesCount(likesResponse.likes_count || 0)

        setError(null)
      } catch (err) {
        setError(err.message)
        setArticle(null)
        setPreviousArticle(null)
        setNextArticle(null)

        console.log('發生錯誤: ', err)
      }
    }

    const fetchLatestArticles = async () => {
      try {
        const response = await api.getAllArticles()
        const sortedArticles = response.data.articles.sort(
          (a, b) => new Date(b.create_time) - new Date(a.create_time)
        )
        setLatestArticles(sortedArticles.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch latest articles:', error.message)
      }
    }
    fetchArticle()
    fetchLatestArticles()
  }, [aid])

  // 偵測到路由後, 取得所有留言
  useEffect(() => {
    if (!aid) {
      console.warn('aid is not defined:', aid)
      return
    }
    const fetchComments = async () => {
      try {
        const response = await api.getComments(aid)
        console.log('Full API response:', response)

        if (Array.isArray(response)) {
          setComments(response)
        } else if (response && typeof response === 'object') {
          console.warn('Unexpected response structure:', response)
          setComments(response.data || [])
        } else {
          console.warn('Unexpected response type:', typeof response)
          setComments([])
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
        setComments([])
      }
    }

    if (aid) {
      fetchComments()
    }
  }, [aid])

  useEffect(() => {
    if (!aid || !auth) return

    const checkUserLikeStatus = async () => {
      try {
        const response = await api.checkUserLikeStatus(aid, !auth.userData.id)
        setArticleLiked(response.isLiked)
      } catch (error) {
        console.error('Failed to check user like status:', error)
      }
    }

    checkUserLikeStatus()
  }, [aid, auth])

  useEffect(() => {
    if (!article || !article.tag2) return

    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACK_API}/article/relatedProducts`,
          {
            params: { tag2: article.tag2 },
          }
        )
        setRelatedProducts(response.data.data.products)
      } catch (error) {
        console.error('Error fetching related products:', error)
      }
    }

    fetchRelatedProducts()
  }, [article])

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <Head>
          <title>{article.title}</title>
          <meta name="description" content={article.content} />
        </Head>
        <div
          className={`${styles['articles']} ${styles['container']} container container-fluid mt-5`}
        >
          <div className={`${styles['container']} ${styles['container-nav']}`}>
            <nav
              aria-label="breadcrumb"
              className={`${styles['article-breadcrumb']}`}
              style={{
                '--bs-breadcrumb-divider': "'>'",
              }}
            >
              <ol className={`${styles['breadcrumb']} breadcrumb`}>
                <li className={`${styles['breadcrumb-item']} breadcrumb-item`}>
                  <Link href="/IGotBrew">首頁</Link>
                </li>
                <li className={`${styles['breadcrumb-item']} breadcrumb-item`}>
                  <Link href="/article">咖啡專欄</Link>
                </li>
                <li
                  aria-current="page"
                  className={`${styles['breadcrumb-item']}  ${styles['active']} breadcrumb-item active`}
                >
                  {article.title}
                </li>
              </ol>
            </nav>
          </div>
          <div
            className={`${styles['container']} ${styles['section1']} container`}
          >
            <div className={`${styles['row']} row`}>
              <div className={`${styles['top-image']} col-12 col-md-10 `}>
                {article.image_url && (
                  <Image
                    src={`http://localhost:3005${article.image_url}`}
                    alt={article.title}
                    width={1000}
                    height={600}
                    className="img-fluid d-flex mx-auto mb-5"
                  />
                )}
              </div>
              <div className={`${styles['tag-group']} d-flex col-9`}>
                <div className={`${styles['tag']} ${styles['tag1']}`}>
                  <div>{article.tag1}</div>
                </div>
                <div className={`${styles['tag']} ${styles['tag2']}`}>
                  <div>{article.tag2}</div>
                </div>
                <div className={`${styles['like']} d-flex my-auto`}>
                  <Image alt="" src={like} />
                  <div className={`${styles['num-like']}`}>
                    <p>{likesCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles['container']} ${styles['title-group']} container col-12 col-md-10 d-flex`}
          >
            <div className={`${styles['title']}`}>
              <p>{article.title}</p>
              <div className={`${styles['title-border']}`} />
              <div className={`${styles['publish-date']}`}>
                {new Date(article.create_time).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div
            className={`${styles['container']} ${styles['article-content']} container col-12 col-md-10`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className={styles['article-content']}
            />
          </div>
          <div
            className={`${styles['container']} ${styles['share-group']} container col-12 col-md-10`}
          >
            <div className={`${styles['share']}`}>
              分享至：{' '}
              <Link href="https://linktr.ee/IGotBrew">
                <Image className={`${styles['share-icon']}`} alt="" src={fb} />
              </Link>
              <Link href="https://linktr.ee/IGotBrew">
                <Image
                  className={`${styles['share-icon']}`}
                  alt=""
                  src={instagram}
                />
              </Link>
            </div>
          </div>
          <div className={`${styles['container']} container`}>
            <div className={`${styles['newPostHeader']}`}>
              <div className={`${styles['title-group']}`}>
                <p>最新文章</p>
                <div className={`${styles['title-border']}`} />
              </div>
            </div>
            <div className={`${styles['newPostBody']}`}>
              <div className={`${styles['card-group']} card-group`}>
                <div
                  className={`${styles['row']} row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3`}
                >
                  {latestArticles.map((latestArticle) => (
                    <div key={latestArticle.id} className={`${styles['col']}`}>
                      <div className={`${styles['card']} ${styles['card1']}`}>
                        <div className={styles['card-image']}>
                          {latestArticle.image_url && (
                            <Image
                              alt={latestArticle.title}
                              width={1000}
                              height={600}
                              className={`${styles['card-image']} img-fluid`}
                              src={`http://localhost:3005${latestArticle.image_url}`}
                            />
                          )}
                        </div>
                        <div className={`${styles['card-body']}`}>
                          <div className={`${styles['tag-group']}`}>
                            <p className={`${styles['tag']} ${styles['tag1']}`}>
                              {latestArticle.tag1}
                            </p>
                            <p className={`${styles['tag']} ${styles['tag2']}`}>
                              {latestArticle.tag2}
                            </p>
                          </div>
                          <div className={styles['publish-date']}>
                            {new Date(
                              latestArticle.create_time
                            ).toLocaleDateString()}
                          </div>
                          <div className={styles['title-group']}>
                            <p className={styles['card-title']}>
                              {latestArticle.title}
                            </p>
                            <div className={styles['title-border']} />
                          </div>
                          <p className={styles['card-text']}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: latestArticle.content,
                              }}
                            />
                          </p>
                          <div className={styles['btn-box']}>
                            <Link
                              className={styles['btn-more']}
                              href={`/article/${String(latestArticle.id)}`}
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
            </div>
            <div className={`${styles['container']} container`}>
              <div className={styles['linkLastNext']}>
                <div className={`${styles['row']} row`}>
                  {previousArticle && (
                    <Link
                      className={`${styles['col']} ${styles['leftGroup']} col col-5 d-flex`}
                      href={`/article/${String(previousArticle.id)}`}
                    >
                      <div
                        className={`${styles['col']} ${styles['angleLeft']} col col-4`}
                      >
                        <FaAngleLeft className={`${styles['fa-angle-left']}`} />
                      </div>
                      <div
                        className={`${styles['col']} ${styles['col-8']} ${styles['previousGroup']}`}
                      >
                        <div className={styles['previous']}>上一篇文章</div>
                        <div className={styles['previous-title']}>
                          {previousArticle.title}
                        </div>
                      </div>
                    </Link>
                  )}
                  <div className={`${styles['col']} col col-2`}>
                    <Image className={styles['logo']} alt="" src={logo} />
                  </div>
                  {nextArticle && (
                    <Link
                      className={`${styles['col']} ${styles['rightGroup']} col col-5 d-flex`}
                      href={`/article/${String(nextArticle.id)}`}
                    >
                      <div
                        className={`${styles['col']} ${styles['nextGroup']} col col-8`}
                      >
                        <div className={styles['next']}>下一篇文章</div>
                        <div className={styles['next-title']}>
                          {nextArticle.title}
                        </div>
                      </div>
                      <div
                        className={`${styles['col']} ${styles['angleRight']} col col-4`}
                      >
                        <FaAngleRight
                          className={`${styles['fa-angle-right']}`}
                        />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`${styles['message']} ${styles['container']} container`}
            >
              <div className={`row ${styles['message-row']} d-flex`}>
                <div
                  className={`${styles['messageGroup']} col-12 col-sm-12 col-md-8`}
                >
                  <div
                    id="comment-section"
                    className={`${styles['messageTitleGroup']} `}
                  >
                    <p>留言</p>
                    <div className={`${styles['message-border']}`} />
                  </div>
                  <div className={`row ${styles['contentSection']}`}>
                    {comments.map((comment) => (
                      <React.Fragment key={comment.id}>
                        <div className={`d-flex ${styles['messageContent']}`}>
                          <div className={`${styles['userImage']}`}>
                            <UserImage
                              className={`${styles['userPic']}`}
                              src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/user/${comment.user_img}`}
                              alt={comment.user_name}
                              width={50}
                              height={50}
                            />
                          </div>
                          <div
                            className={`col-xs-12 col-md-10 col-lg-8 ${styles['userMessage']}`}
                          >
                            <div className={`${styles['userMessageContent']}`}>
                              <span className={`${styles['userName']}`}>
                                {comment.user_name || 'Anonymous'}
                              </span>
                              {comment.content}
                            </div>
                            <div
                              className={`d-flex ${styles['messageStatus']}`}
                            >
                              <div className={`${styles['time']}`}>
                                {formatDate(comment.create_time)}
                              </div>
                              <div className={`${styles['messageReply']}`}>
                                <button
                                  onClick={() =>
                                    handleReplyToggle(comment.id, 'comment')
                                  }
                                >
                                  回覆
                                </button>
                              </div>
                              <button
                                className={`d-flex ${styles['likeMessageGroup']}`}
                                onClick={() =>
                                  handleCommentLikeToggle(comment.id)
                                }
                              >
                                <FaHeart
                                  className={`${styles['fa-heart']} ${
                                    comment.likes_count > 0
                                      ? styles['active']
                                      : ''
                                  }`}
                                />
                                {comment.likes_count > 0 && (
                                  <div
                                    className={`${styles['likeMessageCount']}`}
                                  >
                                    {comment.likes_count}
                                  </div>
                                )}
                              </button>
                              {/* 删除按钮 */}
                              {auth.isAuth &&
                                !auth.userData.id &&
                                comment.user_id === !auth.userData.id && (
                                  <button
                                    className={`${styles['btn-delete']}`}
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                  >
                                    <RiDeleteBinFill />
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                        {/* 回覆欄位 */}
                        {isReplying[`comment-${comment.id}`] && (
                          <div className={`${styles['reply']}`}>
                            <div
                              className={`col-xs-12 col-md-10 col-lg-9 ${styles['userMessage']}`}
                            >
                              <div className={`${styles['replyContent']}`}>
                                <div
                                  className={`${styles['input-group']} input-group`}
                                >
                                  <textarea
                                    className={`${styles['form-control']} form-control mb-3`}
                                    type="text"
                                    rows="1"
                                    placeholder="新增回覆"
                                    aria-label="default input example"
                                    value={replyContent[comment.id] || ''}
                                    onChange={(e) =>
                                      setReplyContent((prev) => ({
                                        ...prev,
                                        [comment.id]: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <div
                                  className={`${styles['btn-group']} btn-group`}
                                >
                                  <button
                                    className={`${styles['btn-cancel']} rounded-pill `}
                                    onClick={() =>
                                      handleReplyToggle(comment.id, 'comment')
                                    }
                                  >
                                    取消
                                  </button>
                                  <button
                                    className={`${styles['btn-send']} rounded-pill ms-2`}
                                    onClick={() =>
                                      handleReplySubmit(comment.id)
                                    }
                                  >
                                    送出
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {comment.replies.map((reply) => (
                          <React.Fragment key={reply.id}>
                            <div className={`d-flex ${styles['commentReply']}`}>
                              <div className={`${styles['userImage']}`}>
                                <UserImage
                                  className={`${styles['userPic']}`}
                                  src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/user/${reply.user_img}`}
                                  alt={reply.user_name}
                                  width={50}
                                  height={50}
                                />
                              </div>
                              <div
                                className={`col-xs-12 col-md-10 col-lg-8 ${styles['userMessage']}`}
                              >
                                <div
                                  className={`${styles['userMessageContent']}`}
                                >
                                  <span className={`${styles['userName']}`}>
                                    {reply.user_name}
                                  </span>
                                  {reply.content}
                                </div>
                                <div
                                  className={`d-flex ${styles['messageStatus']}`}
                                >
                                  <div className={`${styles['time']}`}>
                                    {formatDate(reply.create_time)}
                                  </div>
                                  <div className={`${styles['messageReply']}`}>
                                    <button
                                      onClick={() =>
                                        handleReplyToggle(reply.id, 'reply')
                                      }
                                    >
                                      回覆
                                    </button>
                                  </div>
                                  <button
                                    className={`d-flex ${styles['likeMessageGroup']}`}
                                    onClick={() =>
                                      handleReplyLikeToggle(
                                        reply.id,
                                        comment.id
                                      )
                                    }
                                  >
                                    <FaHeart
                                      className={`${styles['fa-heart']} ${
                                        reply.likes_count > 0
                                          ? styles['active']
                                          : ''
                                      }`}
                                    />
                                    {reply.likes_count > 0 && (
                                      <div
                                        className={`${styles['likeMessageCount']}`}
                                      >
                                        {reply.likes_count}
                                      </div>
                                    )}
                                  </button>
                                  {auth.isAuth &&
                                    !auth.userData.id &&
                                    reply.user_id === !auth.userData.id && (
                                      <button
                                        className={`${styles['btn-delete']}`}
                                        onClick={() =>
                                          handleDeleteReply(
                                            reply.id,
                                            comment.id
                                          )
                                        }
                                      >
                                        <RiDeleteBinFill />
                                      </button>
                                    )}
                                </div>
                              </div>
                            </div>
                            {/* 回覆欄位 */}
                            {isReplying[`reply-${reply.id}`] && (
                              <div className={`${styles['reply']}`}>
                                <div
                                  className={`col-xs-12 col-md-10 col-lg-9 ${styles['userMessage']}`}
                                >
                                  <div className={`${styles['replyContent']}`}>
                                    <div
                                      className={`${styles['input-group']} input-group`}
                                    >
                                      <textarea
                                        className={`${styles['form-control']} form-control mb-3`}
                                        type="text"
                                        rows="1"
                                        placeholder="新增回覆"
                                        aria-label="default input example"
                                        value={replyContent[comment.id] || ''}
                                        onChange={(e) =>
                                          setReplyContent((prev) => ({
                                            ...prev,
                                            [comment.id]: e.target.value,
                                          }))
                                        }
                                      />
                                    </div>
                                    <div
                                      className={`${styles['btn-group']} btn-group`}
                                    >
                                      <button
                                        className={`${styles['btn-cancel']} rounded-pill `}
                                        onClick={() =>
                                          handleReplyToggle(reply.id, 'reply')
                                        }
                                      >
                                        取消
                                      </button>
                                      <button
                                        className={`${styles['btn-send']} rounded-pill ms-2`}
                                        onClick={() =>
                                          handleReplySubmit(comment.id)
                                        }
                                      >
                                        送出
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className={`d-flex ${styles['count-m']}`}>
                    <p>
                      共
                      {comments.reduce((total, comment) => {
                        return (
                          total +
                          1 +
                          (comment.replies ? comment.replies.length : 0)
                        )
                      }, 0)}
                      則留言
                    </p>
                    <button
                      className={`${styles['heartLike']} ${
                        articleLiked ? styles['active'] : ''
                      }`}
                      onClick={handleArticleLikeToggle}
                    >
                      <FaHeart className={styles['fa-heart']} />{' '}
                    </button>
                  </div>
                  {auth.isAuth && !auth.userData.id ? (
                    <div className={`d-flex ${styles['leaveMessage']}`}>
                      <div className={`${styles['userImage']} me-4 mb-5 mt-3`}>
                        <UserImage
                          className={`${styles['userPic']} col`}
                          src={`${
                            process.env.NEXT_PUBLIC_BACK_IMG
                          }/images/user/${!auth.userData.img}`}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = userImage
                          }}
                          alt=""
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className={`${styles['input-wrapper']} mb-3 col-10`}>
                        <textarea
                          className={`${styles['form-control']} form-control rounded-pill px-3 me-2`}
                          type="text"
                          rows="1"
                          placeholder="新增留言"
                          aria-label="default input example"
                          value={newComment}
                          onChange={handleCommentChange}
                        />
                        <button
                          className={`${styles['input-button']} btn btn-send`}
                          onClick={handleCommentSubmit}
                        >
                          <IoSend />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link href="/login" className={`${styles['loginMessage']}`}>
                      <button className="mb-4 loginButton">
                        登入後即可張貼留言
                      </button>
                    </Link>
                  )}
                </div>
                <div
                  className={`col-10 col-sm-10 col-md-3 ${styles['productLink']}`}
                >
                  <div className={styles['linkTitle']}>
                    <p>相關商品</p>
                  </div>
                  {relatedProducts && relatedProducts.length > 0 ? (
                    relatedProducts.map((product, index) => (
                      <div
                        key={index}
                        className={`${styles['product1Link']} ${styles['productBuy']}`}
                      >
                        <Link href={`/product/${product.id}`}>
                          <Image
                            src={`http://localhost:3005/api/images/hello/${product.img}`}
                            alt={product.name}
                            width={100}
                            height={100}
                          />
                          <p>{product.name || 'No description available'}</p>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p>無相關商品</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {showButton && (
          <button onClick={scrollToTop} className={`${styles['gototop']} btn`}>
            <FaAngleUp />
            <br /> Top
          </button>
        )}
        <Footer />
      </div>
    </>
  )
}
