import React from 'react'
import styles from './assets/style/style.module.scss'

//圖片
import bg from './assets/img/bg.png'
import coffee_wave from './assets/img/coffee_wave.png'
import coffee_wave1 from './assets/img/coffee_wave1.png'
import coffee_wave2 from './assets/img/coffee_wave2.png'
import got_brew from './assets/img/got_brew.png'
import surfp from './assets/img/surfp.png'

export default function Footer() {
  return (
    <div className={`${styles['footer-container']} container-fluid`}>
      <div className={`${styles['footer-section1']}`}>
        <div className={`${styles['fsection1-inner']}`}>
          <div className={`${styles['fsimg']}`}>
            <img src={coffee_wave1.src} alt="" />

            <div className={`${styles['surfc']}`}>
              <img src={surfp.src} alt="" />
            </div>

            <div className={`${styles['fswave']}`}>
              <img src={coffee_wave2.src} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles['footer-section2']}`}>
        <div className={`${styles['fsection2-contentd']}`}>
          <div className={`${styles['links-row']}`}>
            <div className={`${styles['links-col']}`}>
              <a href="" className={`${styles['link']}`}>
                全台咖啡廳
              </a>
              <a href="" className={`${styles['link']}`}>
                關於I GOT BREW
              </a>
            </div>
            <div className={`${styles['links-col']}`}>
              <a href="" className={`${styles['link']}`}>
                購物流程
              </a>
              <a href="" className={`${styles['link']}`}>
                選購咖啡機
              </a>
            </div>
          </div>
          <div className={`${styles['contact-col']}`}>
            <img className={`${styles['logo']}`} src={got_brew.src} />
            <div className={`${styles['contact-info']}`}>
              <div className={`${styles['email']}`}>
                <i className="fa-regular fa-envelope" />
                <div className="text">igotbrew@mail.com</div>
              </div>
              <div className={`${styles['phone']}`}>
                <i className="fa-solid fa-phone" />
                <div className="text"> 02 3456 789</div>
              </div>
            </div>
          </div>
          <div className={`${styles['links-row']}`}>
            <div className={`${styles['links-col']}`}>
              <a href="" className={`${styles['link']}`}>
                咖啡證照
              </a>
              <a href="" className={`${styles['link']}`}>
                文章導讀
              </a>
            </div>
            <div className={`${styles['links-col']}`}>
              <a href="" className={`${styles['link']}`}>
                忘記密碼
              </a>
              <a href="" className={`${styles['link']}`}>
                會員設定
              </a>
            </div>
          </div>
        </div>
        <div className={`${styles['fsection2-contentp']}`}>
          <div className={`${styles['links-row']}`}>
            <div className={`${styles['links-col']}`}>
              <a href="" className={`${styles['link']}`}>
                咖啡證照
              </a>
              <a href="" className={`${styles['link']}`}>
                文章導讀
              </a>
              <a href="" className={`${styles['link']}`}>
                全台咖啡廳
              </a>
              <a href="" className={`${styles['link']}`}>
                關於I GOT BREW
              </a>
            </div>
            <div className={`${styles['links-col']}`}>
              <a href="" className={`${styles['link']}`}>
                購物流程
              </a>
              <a href="" className={`${styles['link']}`}>
                選購咖啡機
              </a>
              <a href="" className={`${styles['link']}`}>
                忘記密碼
              </a>
              <a href="" className={`${styles['link']}`}>
                會員設定
              </a>
            </div>
          </div>
          <div className={`${styles['contact-col']}`}>
            <img className={`${styles['logo']}`} src={got_brew.src} />
            <div className={`${styles['contact-info']}`}>
              <div className={`${styles['email']}`}>
                <i className="fa-regular fa-envelope" />
                <div className="text">igotbrew@mail.com</div>
              </div>
              <div className={`${styles['phone']}`}>
                <i className="fa-solid fa-phone" />
                <div className="text"> 02 3456 789</div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles['divider']}`} />
        <div className={`${styles['footer-underword']}`}>
          Design with love ©IGOTBREW2024. All right reserved
        </div>
      </div>
    </div>
  )
}
