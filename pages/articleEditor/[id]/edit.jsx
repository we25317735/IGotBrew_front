import Head from 'next/head'
import styles from '@/styles/publish.module.sass'
import Link from 'next/link'
import Myeditor from '@/components/Myeditor'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaArrowAltCircleLeft } from 'react-icons/fa'
import api from '@/services/articleApi'
import { IoSend } from 'react-icons/io5'
import Header from '@/components/Header'
import Swal from 'sweetalert2'

const Edit = () => {
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [data, setData] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [title, setTitle] = useState('')
  const [tag1, setTag1] = useState('')
  const [tag2, setTag2] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    setEditorLoaded(true)

    if (id) {
      const fetchArticle = async () => {
        try {
          const response = await api.getArticle(id)
          console.log('Fetched data:', response.data)
          const article = response.data.article

          setTitle(article.title)
          setTag1(article.tag1)
          setTag2(article.tag2)
          setData(article.content)
          setImageUrl(article.image_url)
        } catch (error) {
          console.error('無法載入文章', error)
          Swal.fire('錯誤', '無法載入文章', 'error')
        }
      }

      fetchArticle()
    }
  }, [id])

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const uploadFile = async () => {
    const formData = new FormData()
    formData.append('articleImage', selectedFile)

    try {
      const response = await fetch(
        'http://localhost:3005/api/api/article/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('文件上傳失敗！')
      }

      const result = await response.json()
      return result.url
    } catch (error) {
      console.error('上傳錯誤：', error)
      Swal.fire('錯誤', '上傳圖片失敗，請重試。', 'error')
      return null
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '文章標題不能為空。',
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
      return
    }

    if (!selectedFile && !imageUrl) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請上傳封面圖片或保留現有圖片。',
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
      return
    }

    if (!tag1) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請選擇標籤一。',
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
      return
    }

    // 檢查標籤二
    if (!tag2) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請選擇標籤二。',
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
      return
    }

    // 檢查內容
    if (!data.trim()) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '文章內容不能為空。',
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
      return
    }

    const image_url = selectedFile ? await uploadFile() : imageUrl
    const articleData = {
      title,
      tag1,
      tag2,
      content: data,
      image_url,
      valid: 1,
    }

    try {
      if (id) {
        await api.updateArticle(id, articleData)
        Swal.fire({
          icon: 'success',
          title: '成功',
          text: '文章更新成功',
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
      router.push('/articleEditor')
    } catch (error) {
      console.error('保存文章失敗', error)
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '保存發生錯誤，稍後再試。',
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

  return (
    <>
      <Header />
      <Head>
        <title>編輯文章</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.bg} container-fluid`}>
        <div className="container col-md-8">
          <div className="text-center mt-5">
            <div className={styles.title}>編輯文章</div>
            <div className="d-flex justify-content-start mb-5">
              <div>
                <Link
                  href="/articleEditor"
                  className={`${styles['article-btn']} ms-2`}
                >
                  <FaArrowAltCircleLeft />
                </Link>
              </div>
            </div>
          </div>
          <div className="input-group mb-3">
            <span className={`${styles.inputText} input-group-text`}>
              文章標題
            </span>
            <input
              className={`${styles['form-control1']} form-control`}
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <span className={`${styles.inputText} input-group-text mb-4`}>
              上傳封面圖片
            </span>
            <input
              className={`${styles['form-control2']} form-control mb-4`}
              type="file"
              name="articleImage"
              onChange={handleFileChange}
            />
            {imageUrl && (
              <div className="mb-3">
                <img
                  src={`http://localhost:3005${imageUrl}`}
                  alt="文章封面"
                  style={{ maxWidth: '100%' }}
                />
              </div>
            )}
          </div>
          <div className="input-group mb-3">
            <span className={`${styles.inputText} input-group-text  mb-3`}>
              標籤
            </span>
            <select
              className={`${styles['form-select']} form-select  mb-3`}
              aria-label="Default select example"
              value={tag1}
              onChange={(e) => setTag1(e.target.value)}
            >
              <option value="">請選擇#標籤一</option>
              <option value="新手">新手</option>
              <option value="老手">老手</option>
            </select>
            <select
              className={`${styles['form-select']} form-select  mb-3`}
              aria-label="Default select example"
              value={tag2}
              onChange={(e) => setTag2(e.target.value)}
            >
              <option value="">請選擇#標籤二</option>
              <option value="咖啡豆">咖啡豆</option>
              <option value="咖啡機">咖啡機</option>
              <option value="配件">配件</option>
            </select>
          </div>
          <Myeditor
            name="article"
            onChange={(data) => {
              setData(data)
            }}
            value={data}
            editorLoaded={editorLoaded}
          />
          <div className="input-group mt-5 mb-5">
            <button
              className={`${styles['btn-send']} ms-auto btn`}
              onClick={handleSubmit}
            >
              <IoSend />
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default Edit
