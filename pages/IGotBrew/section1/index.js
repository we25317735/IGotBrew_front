import React from 'react'
import styles from './assets/style/style.module.scss'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import axios from 'axios'
import Swal from 'sweetalert2'

import coffeefilter from './assets/img/coffeefilter.png'
import logo from './assets/img/logo.png'
import slogan from './assets/img/slogan.png'
import placard from './assets/img/placard.png'
import handsBox from './assets/img/Hands_Box.png'
import cup from './assets/img/cup.png'
import plate from './assets/img/plate.png'
import ball1 from './assets/img/ball1.png'
import ball2 from './assets/img/ball4.png'
import beans from './assets/img/beans.png'
import coffeesplit from './assets/img/coffeesplit.png'
import coffeebeanboy from './assets/img/coffeebeanboy.png'
import { IoClose } from 'react-icons/io5'
import Image from 'next/image'
import NineCoupon from './assets/img/nineCoupon.png'

// 使用者資訊
import { useAuth } from '@/hooks/use-auth'

// 桌機版
export default function Section1() {
  // 使用者部分
  const { auth, setAuth, handleCheckAuth } = useAuth()

  const [isCouponClaimed, setIsCouponClaimed] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    document
      .querySelector(`.${styles['coffee-plate']} img`)
      .classList.add(styles['animate-plate'])
    document
      .querySelector(`.${styles['coffee-cup']} img`)
      .classList.add(styles['animate-cup'])
    document
      .querySelector(`.${styles['coffeesplit']}`)
      .classList.add(styles['animate-coffeesplit'])
    document
      .querySelector(`.${styles['ball2']}`)
      .classList.add(styles['animate-ball2'])
    document
      .querySelector(`.${styles['ball1']}`)
      .classList.add(styles['animate-ball1'])
    document
      .querySelector(`.${styles['beans']}`)
      .classList.add(styles['animate-beans'])
    if (auth && auth.userData.id) {
      setIsLoggedIn(true)
      checkCouponStatus()
    } else {
      setIsLoggedIn(false)
    }
  }, [auth])

  const checkCouponStatus = async () => {
    if (auth && auth.userData.id) {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/api/IGotBrew/check-coupon/${auth.userData.id}`
        )
        setIsCouponClaimed(response.data.alreadyClaimed)
      } catch (error) {
        console.error('Error checking coupon status:', error)
      }
    }
  }

  const handleClaimCoupon = async () => {
    if (auth && auth.userData.id && !isCouponClaimed) {
      try {
        const response = await axios.post(
          'http://localhost:3005/api/api/IGotBrew/claim-coupon',
          {
            userId: auth.userData.id,
            couponId: 1,
            quantity: 1,
          }
        )
        if (response.data.message === '優惠券領取成功') {
          setIsCouponClaimed(true)
        }
      } catch (error) {
        console.error('Error claiming coupon:', error)
      }
    }
    if (!auth) {
      Swal.fire({
        title: '先登入再領取吧～',
        width: 600,
        padding: '3em',
        color: '#2b4f61',
        background: '#fff',
        fontSize: '2.0rem',
        backdrop: `
          #1c394877
          left top
          no-repeat
        `,
        confirmButtonColor: '#2b4f61', // 設置按鈕顏色
        confirmButtonText: '確認', // 按鈕文字
        customClass: {
          confirmButton: 'swal2-confirm-custom',
          cancelButton: 'swal2-cancel-custom',
        },
        didOpen: () => {
          const confirmBtn = document.querySelector('.swal2-confirm-custom')
          const cancelBtn = document.querySelector('.swal2-cancel-custom')

          if (confirmBtn) {
            confirmBtn.style.fontSize = '16px'
            confirmBtn.style.padding = '7px 18px'
          }

          if (cancelBtn) {
            cancelBtn.style.fontSize = '16px'
            cancelBtn.style.padding = '7px 18px'
          }
        },
      })
    }
  }
  return (
    <div className={`${styles['section1']}`}>
      <div className={`${styles['section1_container']} container d-flex`}>
        <div className={`${styles['left-section']}`}>
          <div className={`${styles['imagegroup']}`}>
            <Image
              src={coffeefilter}
              className={`${styles['image2']}`}
              alt=""
            />
            <Image
              src={logo}
              className={`${styles['image']} ${styles['image_rotate']}`}
              alt=""
            />
          </div>
          <div className={`${styles['section1-text']}`}>
            <div className={`${styles['slogan']}`}>
              <Image src={slogan} alt="" />
            </div>
            <div className={`${styles['placard']}`}>
              <Image src={placard} alt="" />
            </div>
          </div>
        </div>
        <div className={`${styles['suprise-box']}`}>
          <a
            className={`${styles['btn']} ${styles['box-link']}`}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            type="button"
          >
            <Image src={handsBox} alt="" />
          </a>
        </div>
        <div className={`${styles['right-section']}`}>
          <div className={`${styles['coffeegroup']}`}>
            <div className={`${styles['coffee-cup']}`}>
              <Image src={cup} alt="" className={`${styles['cup']}`} />
            </div>
            <div className={`${styles['coffee-plate']}`}>
              <Image src={plate} alt="" />
            </div>
            <div className={`${styles['split']}`}>
              <Image className={`${styles['ball1']}`} src={ball1} alt="" />
              <Image className={`${styles['ball2']}`} src={ball2} alt="" />
              <Image className={`${styles['beans']}`} src={beans} alt="" />
              <Image
                className={`${styles['coffeesplit']}`}
                src={coffeesplit}
                alt=""
              />
            </div>
          </div>
        </div>

        <div
          className={`${styles['modalSection1']} modal fade`}
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className={`${styles['modal-content']} modal-content`}>
              <div className={`${styles['closeEnd']}`}>
                <button
                  type="button"
                  className={`${styles['supriseClose']}`}
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <IoClose />
                </button>
              </div>
              <div className={`${styles['modal-body']} modal-body`}>
                <div className="row">
                  <div className={`col-9 ${styles['couponSlogan']}`}>
                    <Image
                      className={`${styles['logoBean']}`}
                      src={coffeebeanboy}
                      alt=""
                    />
                    <p>被你發現了！</p>
                    <p>偷偷送你優惠券，別說我藏在這喔</p>
                  </div>
                </div>
                <div className={`col-9 ${styles['couponArea']}`}>
                  <Image
                    className={`${styles['coupon']}`}
                    src={NineCoupon}
                    alt=""
                  />
                  <button
                    onClick={handleClaimCoupon}
                    disabled={isCouponClaimed}
                  >
                    {isCouponClaimed ? '已經領取' : '開心收下'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
