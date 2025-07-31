import React from 'react'
import styles from './assets/style/style.module.scss'
// import Mr_brew from './assets/img/1.gif'
import Mr_brew from './assets/img/12.png'

export default function Page404() {
  // const text = '目前沒有東西呦 ~'
  const text = ' '
  return (
    //<div className="bg-info" style={{ width: '100%', height: '100vh' }}></div>

    <div id={styles['Page-404']}>
      <div className={styles['box-404']}>
        <div className={`${styles['img-box']} mx-auto`}>
          {/* <img
            src={Mr_brew.src}
            className="mx-auto d-block me-5"
            alt="404 Page Image"
            // style={{ objectFit: 'cover' }}
          /> */}
        </div>
        <p className="mt-5">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className={styles['wave']}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
