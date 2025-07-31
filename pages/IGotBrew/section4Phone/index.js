import React, { useState, useEffect } from 'react'
import styles from './assets/style/style.module.scss'
import Image from 'next/image'
import coffee from './assets/img/coffee.jpg'
import coffee4 from './assets/img/coffee4.jpg'
import caffeine from './assets/img/caffeine.jpg'
import coffee6 from './assets/img/coffee6.jpg'
import coffeemachine from './assets/img/coffeemachine.jpg'
import coffeeflavor from './assets/img/coffeeflavor.jpg'
import buttonmask from './assets/img/buttonmask.png'
import { FaAngleRight } from 'react-icons/fa'
import api from '@/services/articleApi'
import Link from 'next/link'
import pour from '../assets/img/pour down 1.png'

export default function Section4Phone() {
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

  return (
    <>
      <div
        className={`${styles['section4-phone']} ${styles['container']}`}
        style={{ position: 'relative' }}
      >
        <Image
          src={pour}
          style={{
            width: '100vw',
            height: '360px',
            position: 'absolute',
            top: '-60px',
            left: '0px',
            zIndex: '0',
          }}
        />
        <div className={`${styles['article-title']}`}>
          <h1 style={{ zIndex: '1' }}>咖啡專欄</h1>
        </div>
        <div
          className={`${styles['container-article']} ${styles['container-fluid']}`}
        >
          <div className={`${styles['cardgroup']} ${styles['cardgroup1']}`}>
            {latestArticles.map((article, index) => (
              <div
                key={index}
                className={`${styles['card']} ${styles['cardmove']} ${
                  styles[`card${index + 1}`]
                }`}
              >
                <div className={`${styles['card-image']}`}>
                  {article.image_url && (
                    <Image
                      src={`http://localhost:3005${article.image_url}`}
                      className={`${styles['image']} ${
                        styles[`image${index + 1}`]
                      }`}
                      alt={article.title}
                      width={600}
                      height={400}
                    />
                  )}
                </div>
                <div className={`${styles['card-body']}`}>
                  <div className={`${styles['tag-group']}`}>
                    <p className={`${styles['tag']} ${styles['tag1']}`}>
                      # 新手
                    </p>
                    <p className={`${styles['tag']} ${styles['tag2']}`}>
                      # 咖啡豆
                    </p>
                  </div>
                  <div className={`${styles['publish-date']}`}>
                    {new Date(article.create_time).toLocaleDateString()}
                  </div>
                  <div className={`${styles['title-group']}`}>
                    <p className={`${styles['card-title']}`}>{article.title}</p>
                    <div className={`${styles['title-border']}`} />
                  </div>
                  <div
                    className={`${styles['card-text']}`}
                    dangerouslySetInnerHTML={{
                      __html: article.content.substring(0, 100),
                    }}
                  />
                  <div className={`${styles['btn-box']}`}>
                    <Link
                      href={`/article/${article.id}`}
                      className={`${styles['btn-more']}`}
                    >
                      READ MORE
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`d-flex`}>
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
      </div>
    </>
  )
}
