// result.js
import React from 'react'
import Image from 'next/image'
import styles from './assets/style/result.module.scss'
import arrowRight from './assets/img/arrow-right.png'
import titleBean from './assets/img/title-bean.png'
import { results } from './quizConfig'
import Link from 'next/link'
import ResultArticle1 from './assets/img/result-article1.png'
import ResultArticle2 from './assets/img/result-article2.png'
import ResultCourse1 from './assets/img/result-course1.png'
import ResultCourse2 from './assets/img/result-course2.png'
import ResultBean1 from './assets/img/result-bean1.webp'
import ResultBean2 from './assets/img/result-bean2.webp'
import ResultMachine1 from './assets/img/result-machine1.webp'
import ResultMachine2 from './assets/img/result-machine2.png'
import buttonmask from './assets/img/buttonMask.png'
import { FaAngleRight } from 'react-icons/fa'
const Result = ({ answers, onRestart }) => {
  const getResult = () => {
    const article = results.articles[answers[0]]
    // answers[0]就是第一題的數字是0或1(左邊或右邊)
    //例如 article變數會等於results.articles[0](給的結果資料第一個)
    const course = results.courses[answers[0]]
    const bean = results.beans[answers[1]]
    const machine = results.machines[answers[2]]

    return { article, course, bean, machine }
  }

  const { article, course, bean, machine } = getResult()

  const handleRestartClick = (e) => {
    e.preventDefault()
    onRestart()
  }
  return (
    <div className={styles.outside}>
      <div className={styles.mywrap}>
        <div className={styles.question}>
          <p>以下是為您量身打造的套餐</p>
        </div>
        <div className={styles.down}>
          <div className={styles.insideWrap}>
            <div className={styles.mycard}>
              <div className={styles.cardImg}>
                <Image src={machine.image} alt="" width={20} height={20} />
              </div>
              <div className={styles.mycardRight}>
                <div className={styles.title}>
                  <Image src={titleBean} alt="" width={20} height={20} />
                  <p className={styles.titleFont}>{machine.title}</p>
                </div>
                <div className={styles.body}>
                  <p>{machine.description}</p>
                </div>
                <button
                  className={styles.button}
                  onClick={() => (window.location.href = machine.url)}
                >
                  <Image src={arrowRight} alt="" width={20} height={20} />
                  <p>看產品</p>
                </button>
              </div>
            </div>
            <div className={`${styles.mycard} ${styles.cardSmall}`}>
              <div className={styles.cardImg}>
                <Image src={article.image} alt="" width={20} height={20} />
              </div>
              <div className={styles.mycardRight}>
                <div className={styles.title}>
                  <Image src={titleBean} alt="" width={20} height={20} />
                  <p className={styles.titleFont}>{article.title}</p>
                </div>
                <button
                  className={styles.button}
                  onClick={() => (window.location.href = article.url)}
                >
                  <Image src={arrowRight} alt="" width={20} height={20} />
                  <p>看文章</p>
                </button>
              </div>
            </div>
          </div>
          <div className={styles.insideWrap}>
            <div className={`${styles.mycard} ${styles.cardSmall}`}>
              <div className={styles.cardImg}>
                <Image src={bean.image} alt="" width={20} height={20} />
              </div>
              <div className={styles.mycardRight}>
                <div className={styles.title}>
                  <Image src={titleBean} alt="" width={20} height={20} />
                  <p className={styles.titleFont}>{bean.title}</p>
                </div>
                <button
                  className={styles.button}
                  onClick={() => (window.location.href = bean.url)}
                >
                  <Image src={arrowRight} alt="" width={20} height={20} />
                  <p>看產品</p>
                </button>
              </div>
            </div>
            <div className={styles.mycard}>
              <div className={styles.cardImg}>
                <Image src={course.image} alt="" width={20} height={20} />
              </div>
              <div className={styles.mycardRight}>
                <div className={styles.title}>
                  <Image src={titleBean} alt="" width={20} height={20} />
                  <p className={styles.titleFont}>{course.title}</p>
                </div>
                <button
                  className={styles.button}
                  onClick={() => (window.location.href = course.url)}
                >
                  <Image src={arrowRight} alt="" width={20} height={20} />
                  <p>看課程</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        <a href="" onClick={handleRestartClick} className={styles.onemore}>
          <div className={`${styles['buttonguide']}`}>
            <div className={`${styles['buttonmask']}`}>
              <Image src={buttonmask} alt="" />
            </div>
            <div className={`${styles['button-content']}`}>
              <div className={`${styles['button-text']}`}>再測一次</div>
              <div className={`${styles['button-icon']}`}>
                <FaAngleRight />
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}

export default Result
