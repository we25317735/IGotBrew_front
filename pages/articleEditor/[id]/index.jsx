import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/articleEditorDetail.module.sass'
import api from '@/services/articleApi'
import { FaArrowAltCircleLeft } from 'react-icons/fa'
import { ImPencil2 } from 'react-icons/im'
import Header from '@/components/Header'

const Article = () => {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { id } = router.query

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

  useEffect(() => {
    if (!id) return

    const fetchArticle = async () => {
      setLoading(true)
      try {
        const response = await api.getArticle(id)
        console.log('Fetched data:', response.data)

        const data = response.data.article

        if (!data) {
          throw new Error('Article not found')
        }

        const updatedArticle = {
          ...data,
          content: updateImageTags(data.content),
        }

        setArticle(updatedArticle)
        setError(null)
      } catch (err) {
        setError(err.message)
        setArticle(null)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  useEffect(() => {
    if (article) {
      const images = document.querySelectorAll('.article img')
      images.forEach((img) => {
        img.classList.add('img-fluid')
      })
    }
  }, [article])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!article) return <div>Article not found</div>

  return (
    <>
      <Header />
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.content} />
      </Head>
      <main className={`${styles.bg} container-fluid`}>
        <div className="container justify-content-center d-flex align-content-center">
          <div
            className={`py-5 ${styles['article-container']} justify-content-center align-content-center `}
            style={{ maxWidth: 1000 }}
          >
            {article.image_url && (
              <Image
                src={`http://localhost:3005${article.image_url}`}
                alt={article.title}
                width={1000}
                height={600}
                className="img-fluid d-flex mx-auto mb-5"
              />
            )}

            <h1 className={`text-center ${styles['article-title']} mb-4`}>
              {article.title}
            </h1>
            <div className={`${styles['tag-group']} card-subtitle d-flex mb-2`}>
              <div className={`${styles['tag1']}`}>{article.tag1}</div>
              <div className={`${styles['tag2']}`}>{article.tag2}</div>
            </div>
            <div
              className={`text-muted text-center mb-5 ${styles['article-time']}`}
            >
              發佈日期：{new Date(article.create_time).toLocaleDateString()}
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className={styles['article-content']}
            />
            <div
              className={`${styles['detail-btn']} d-flex justify-content-between align-items-center w-100`}
            >
              <Link
                href="/articleEditor"
                className={`${styles['article-btn']} my-auto`}
              >
                <FaArrowAltCircleLeft />
              </Link>
              <Link
                href={`/articleEditor/${article.id}/edit`}
                className={`${styles['btn-edit']} btn mt-3`}
              >
                <ImPencil2 />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Article
