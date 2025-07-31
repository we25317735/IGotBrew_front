// quizConfig.js
// result.js

import ResultArticle1 from './assets/img/result-article1.png'
import ResultArticle2 from './assets/img/result-article2.png'
import ResultCourse1 from './assets/img/result-course1.png'
import ResultCourse2 from './assets/img/result-course2.png'
import ResultBean1 from './assets/img/result-bean1.webp'
import ResultBean2 from './assets/img/result-bean2.webp'
import ResultMachine1 from './assets/img/result-machine1.webp'
import ResultMachine2 from './assets/img/result-machine2.png'

export const questions = [
  {
    question: `嗨! 歡迎來到咖啡世界\n請問是咖啡博士嗎？`,
    answers: [
      '我喜歡喝咖啡，是遨遊在咖啡世界的老手',
      '我是咖啡新手，對於咖啡世界充滿好奇',
    ],
  },
  {
    question: '喜歡喝的咖啡風味是？',
    answers: [
      '我喜歡喝濃郁豐富、帶點苦味的咖啡',
      '我喜歡喝清新明亮、帶點清爽的酸度',
    ],
  },
  {
    question: '平常喝咖啡的習慣是？',
    answers: ['希望可以簡易快速地喝到咖啡', '享受製作咖啡的過程，並細細品嘗'],
  },
]

export const results = {
  articles: [
    {
      title: '咖啡烘焙_ 了解烘焙三階段',
      image: ResultArticle1,
      url: '/article/1',
    },
    {
      title: '如何挑選咖啡豆_烘焙度篇',
      image: ResultArticle2,
      url: '/article/4',
    },
  ],
  courses: [
    {
      title: 'SCA Barista Skills',
      image: ResultCourse1,
      url: '/course/1',
    },
    {
      title: '咖啡品嚐基礎課程',
      image: ResultCourse2,
      url: '/course/35',
    },
  ],
  beans: [
    {
      title:
        '【Simple Kaffa 興波咖啡】阿寶綜合咖啡豆 深焙 200公克(世界冠軍吳則霖)',
      image: ResultBean1,
      url: '/product/23',
    },
    {
      title: '【生態綠OKO】單品咖啡豆 ／衣索比亞／淺烘焙（250g）',
      image: ResultBean2,
      url: '/product/3',
    },
  ],
  machines: [
    {
      title: ' Nespresso 膠囊咖啡機 Essenza Mini_四色可選 ',
      image: ResultMachine1,
      url: '/product/62',
    },
    {
      title: '【Philips 飛利浦】半自動雙研磨義式咖啡機(ESS5228/02)',
      image: ResultMachine2,
      url: '/product/88',
    },
  ],
}
