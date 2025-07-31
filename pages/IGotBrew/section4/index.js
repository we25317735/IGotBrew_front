import React, { useState, useEffect } from 'react'
import styles from './assets/style/style.module.scss'
import Image from 'next/image'
import buttonmask from './assets/img/buttonmask.png'
import { FaCaretLeft, FaCaretRight, FaAngleRight } from 'react-icons/fa'
import api from '@/services/articleApi'
import Link from 'next/link'
import pour from '../assets/img/pour down 1.png'

export default function Section4() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [latestArticles, setLatestArticles] = useState([])

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await api.getAllArticles()
        const sortedArticles = response.data.articles.sort(
          (a, b) => new Date(b.create_time) - new Date(a.create_time)
        )
        setLatestArticles(sortedArticles.slice(0, 6))
      } catch (error) {
        console.error('Failed to fetch latest articles:', error.message)
      }
    }

    fetchLatestArticles()
  }, [])

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < Math.ceil(latestArticles.length / 3) - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <>
      <div className={`${styles['section4']} ${styles['container']} container`}>
        <Image
          src={pour}
          style={{
            width: '100%',
            height: '360px',
            position: 'absolute',
            top: '-40px',
            zIndex: '0',
          }}
        />
        <div className={`${styles['article-title']}`}>
          <h1 style={{ zIndex: '1' }}>咖啡專欄</h1>
          <div className={`${styles['button-article']}`}>
            <a href="">
              <div className={`${styles['buttonguide']}`}>
                <div className={`${styles['buttonmask']}`}>
                  <Image src={buttonmask} alt="" />
                </div>
                <div className={`${styles['button-content']}`}>
                  <div className={`${styles['button-text']}`}>
                    文章一覽
                    <FaAngleRight />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div
          className={`${styles['container-article']} ${styles['container-fluid']}`}
        >
          {currentIndex > 0 && (
            <button className={`${styles['arrow-left']}`} onClick={handlePrev}>
              <FaCaretLeft />
            </button>
          )}
          <div className={`${styles['cardgroup']} ${styles['cardgroup1']}`}>
            {latestArticles
              .slice(currentIndex * 3, currentIndex * 3 + 3)
              .map((latestArticle) => (
                <div
                  key={latestArticle.id}
                  className={`${styles['col']} col-3`}
                >
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
                      <div className={styles['card-text']}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: latestArticle.content,
                          }}
                        />
                      </div>
                      <div className={styles['btn-box']}>
                        <Link
                          className={styles['btn-more']}
                          href={`/article/${latestArticle.id}`}
                        >
                          READ MORE
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {currentIndex < Math.ceil(latestArticles.length / 3) - 1 && (
            <button className={`${styles['arrow-right']}`} onClick={handleNext}>
              <FaCaretRight />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
