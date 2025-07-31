// index.js
import React, { useState, useRef } from 'react'
import Quiz from './component/Quiz'
import Result from './component/result'

const CoffeeWorld = () => {
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState([])
  const quizRef = useRef(null)
  //Ref的用處是重新跳轉第一問題這個視窗位置
  const handleQuizComplete = (quizAnswers) => {
    setAnswers(quizAnswers)
    setShowResult(true)
  }

  const handleRestart = () => {
    setShowResult(false)
    setAnswers([])
    // 使用 setTimeout 確保在狀態更新後執行滾動
    setTimeout(() => {
      if (quizRef.current) {
        quizRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 0)
  }

  return (
    <div ref={quizRef}>
      {/* 如果不是透過Quiz裡OnComplete回傳答案結果來這,透過這裡的handleQuizComplete傳參數進來，並讓showResult轉變為true的話
    顯示Quiz(問題頁)，否則就是result(結果頁) */}
      {!showResult ? (
        <Quiz onComplete={handleQuizComplete} />
      ) : (
        <Result answers={answers} onRestart={handleRestart} />
      )}
    </div>
  )
}

export default CoffeeWorld
