import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './assets/style/style.module.scss'
import Left from './assets/img/left.png'
import Right from './assets/img/right.png'
import WhiteLogo from './assets/img/white-logo.png'
import { questions } from '../../../utils/quizConfig'

const Quiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [hovered, setHovered] = useState({ left: false, right: false })
  const [isMobile, setIsMobile] = useState(false)

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onComplete(newAnswers)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // check initial size

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={`container-fluid ${styles.outside}`}>
      <div className={styles.wrap}>
        <div className={styles.question}>
          <p>{questions[currentQuestion].question}</p>
        </div>
        <div className={styles.answers}>
          <button
            className={`${styles.answer} ${styles.answerLeft}`}
            onClick={() => handleAnswer(0)}
            onMouseEnter={() =>
              !isMobile && setHovered({ ...hovered, left: true })
            }
            onMouseLeave={() =>
              !isMobile && setHovered({ ...hovered, left: false })
            }
          >
            <p>{questions[currentQuestion].answers[0]}</p>
          </button>
          <Image
            src={WhiteLogo}
            alt=""
            className={styles.logoWhite}
            width={100}
            height={100}
          />
          <button
            className={`${styles.answer} ${styles.answerRight}`}
            onClick={() => handleAnswer(1)}
            onMouseEnter={() =>
              !isMobile && setHovered({ ...hovered, right: true })
            }
            onMouseLeave={() =>
              !isMobile && setHovered({ ...hovered, right: false })
            }
          >
            <p>{questions[currentQuestion].answers[1]}</p>
          </button>
          <Image
            src={WhiteLogo}
            alt=""
            className={styles.logoWhitePhone}
            width={100}
            height={100}
          />
        </div>
        <div
          className={`${styles.bg} ${styles.left} ${
            hovered.left ? styles.fadeIn : styles.fadeOut
          }`}
        >
          <Image src={Left} alt="" layout="fill" objectFit="cover" />
        </div>
        <div
          className={`${styles.bg} ${styles.right} ${
            hovered.right ? styles.fadeIn : styles.fadeOut
          }`}
        >
          <Image src={Right} alt="" layout="fill" objectFit="cover" />
        </div>
      </div>
    </div>
  )
}

export default Quiz
