import React from 'react'
import styles from '@/styles/cart.module.scss'

export default function CartHeader({ active }) {
  // 根據數字 1 ~ 3 決定 active 哪個
  const steps = ['購物車', '訂單確認', '訂單完成']

  return (
    <div className={`mx-3 row justify-content-center ${styles.cart}`}>
      <div
        className={`col-md-5 col-12 d-flex justify-content-between ${styles['cart-header']}`}
      >
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const isActive = active === stepNumber
          return (
            <div
              key={label}
              className={`d-flex align-items-center text-nowrap ${
                styles.step
              } ${styles.h3} ${isActive ? styles['step-active'] : ''}`}
            >
              <span className="me-md-3 me-2">{stepNumber}</span>
              {label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
