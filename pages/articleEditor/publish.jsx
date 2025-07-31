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

const Publish = () => {
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [data, setData] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [title, setTitle] = useState('')
  const [tag1, setTag1] = useState('')
  const [tag2, setTag2] = useState('')
  const router = useRouter()

  const defaultTitle = '成為精品咖啡大師，從暸解杯測開始！'
  const defaultTag1 = '老手'
  const defaultTag2 = '咖啡豆'
  const defaultData = `▍為什麼要杯測？杯測的作用為何？

你是否曾經看著咖啡豆袋上令人眼花撩亂的風味描述、高分評價，卻不知道這些東西是怎麼來的？

這些對於認識精品咖啡以及確認咖啡的品質而言重要的資訊，需要嚴謹的程序來盡可能確保準確與客觀。因此「杯測（cupping）」就此誕生。

▍咖啡界的「共同語言」

事實上，杯測這個活動並非咖啡獨有，大家應該有聽過的「品酒師」、「品茶師」，專家們藉由經過一連串固定、具有完整規範與手續的動作，品出飲品風味，再將得出的結果傳達給同業及消費者，並確定商品的價值。



「杯測師」或是各店家自己的烘豆師就是在咖啡這裡對應的角色。杯測的過程就像是一種「共同語言」，唯有經過這個程序，才能讓業者與業者、業者與消費者之間都確定這些風味的描述具有足夠的公信力。

 

▍標準化的杯測程序

像這樣的評分機制，其實在國際上相當普遍，而要有公平、公正的分數，公定、客觀的杯測流程就是最重要的一環。

既然杯測是咖啡的「共同語言」，杯測的方式當然就不會是杯測師愛怎麼喝就怎麼喝，而是有個標準化的流程，盡可能減少不同杯測環境、方式造成的誤差。



1.乾、濕香

聞乾香，是杯測的第一步驟，可以先確認咖啡的品質、香氣調性的走向。方法很簡單，就是把粉倒入杯中後，仔細聞嗅。

經過聞乾香之後，把熱水倒入杯中，並利用為杯測專門設計的杯子，製造熱水的漩渦水流，以充分翻攪咖啡。

浸泡一段時間後，再一次靠近杯邊，聞嗅浸濕之後的咖啡粉香。這樣的聞香方式，可以盡可能避免一般沖煮方式可能因為器材條件、沖煮手法，甚至濾紙等等的影響，讓聞出來的香味更客觀。



2.破渣、撈渣

接著，杯測師會把浸泡過後的粉層，用湯匙的底部在水面抹一圈，將覆蓋在表面上粉殼破開。同時，再次將鼻子靠近，會聞到咖啡液體的香氣「破殼而出」。

破開之後的咖啡液體，還會有咖啡粉浮在水面上，因此為了不要讓杯測師喝下一大口咖啡粉，杯測師會將兩支湯匙交疊在一起，將粉撈起，這大概是唯一一個不以聞香為目的的動作。但要撈得乾淨看似容易，實際操作時沒有專業的手勢很容易導致咖啡粉沈澱！



3.啜吸

最後，或許也是杯測最為人所知的動作，就是啜吸啦！

咖啡師會利用湯匙撈滿一匙量的咖啡液，快速地把咖啡液吸入口。讓咖啡在吸入的過程中經過齒間，使其呈現霧狀，盡可能地讓咖啡液體充滿整個口腔，接觸舌頭上的味蕾以及鼻子裡的嗅覺受器。這樣才能更加準確且完整地體驗到咖啡的風味、得到更精準的評分以及風味描述。

不同於傳統杯測方式的是，我們的烘豆師遵循最近提倡的「衛生杯測」，會把咖啡撈到小杯子中，再一口吸進去。響應防疫觀念，確保杯測的流程中最高標準的衛生條件。



▍ 杯測的指標

除了標準的杯測流程外，「根據什麼」來杯測也很重要。判斷一杯咖啡的好壞，需要給每一支咖啡豆共同要面對的「考題」，也就是國際上通用的指標！

雖說在不同的機構、店家之間會略有差異，或是有不同的權重。但大致上都是圍繞著「香氣、乾淨度、甜感、酸值、口感、風味、餘韻、整體感」這八大指標。



▍ 從頭到腳檢驗的品質保證

看了上面的介紹，你可能還會好奇，什麼場合會需要杯測呢？除了咖啡豆的競標、評級之外，生豆商、熟豆店家也都需要針對自己的產品進行杯測。

以烘豆師們來說，杯測可以說是他們每一天幾乎都會進行的工作。從進貨前挑選生豆、檢驗樣品，到烘豆前研究、確定烘焙手法的打樣，甚至售後的反覆檢驗，全部都要經過嚴謹、完整的杯測流程，希望每一位消費者拿到的咖啡都是最高品質。



而在烘豆師們杯測的過程中，也會依照上面說的八大指標來計分。除了可以更好地在彼此之間溝通，更有系統地記錄數據，同時也將風味的表現，轉化為消費者容易理解的數字，讓咖啡的風味更直覺、易懂。`

  const handleAutoFill = () => {
    setTitle(defaultTitle)
    setTag1(defaultTag1)
    setTag2(defaultTag2)
    setData(defaultData)
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const uploadFile = async () => {
    if (!selectedFile) {
      Swal.fire('提示', '請選擇一個文件來上傳', 'warning')
      return null
    }

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
      console.log(result)
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

    // 檢查封面圖片
    if (!selectedFile) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請上傳封面圖片。',
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

    // 檢查標籤一
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

    // 如果所有驗證通過，則繼續處理圖片上傳和文章發布
    const image_url = await uploadFile()

    if (!image_url) {
      Swal.fire('錯誤', '無法獲取圖片URL，請確認圖片已經成功上傳。', 'error')
      return
    }

    const articleData = {
      title,
      image_url,
      tag1,
      tag2,
      content: data,
      create_time: new Date().toISOString(),
      valid: 1,
    }

    console.log('準備發布的文章數據:', articleData)

    try {
      const result = await api.publishArticle(articleData)
      console.log('發布結果:', result)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '文章上傳成功',
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
      router.push('/articleEditor')
    } catch (error) {
      console.error('上傳文章失敗', error)
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '上傳發生錯誤，稍後再試。',
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

  useEffect(() => {
    setEditorLoaded(true)
  }, [])

  return (
    <>
      <Header />
      <Head>
        <title>發表文章</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.bg} container-fluid`}>
        <div className={`${styles.container} container col-md-8`}>
          <div className="text-center mt-5">
            <button
              className={`${styles.fillInBtn}`}
              onClick={handleAutoFill}
              id="auto-fill-btn"
            >
              自動填入
            </button>

            <div className={styles.title}>發表文章</div>
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
            <span className={`${styles.inputText} input-group-text`}>
              上傳封面圖片
            </span>
            <input
              className={`${styles['form-control2']} form-control`}
              type="file"
              name="articleImage"
              onChange={handleFileChange}
            />
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
            value={data}
            onChange={(data) => setData(data)}
            editorLoaded={editorLoaded}
          />
          <div className="input-group mt-5">
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

export default Publish
