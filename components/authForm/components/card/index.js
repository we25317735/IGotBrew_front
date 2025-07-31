import React, { useState, useEffect, useContext } from 'react'
import styles from './assets/style/style.module.scss'
import axios from 'axios'

import Login_module from '../login_module'
import Register_module from '../register_module'

// 根據 prop 渲染登入或註冊
export default function Card({ mode }) {
  const [activeTab, setActiveTab] = useState(mode)

  // 變換 登入/註冊 時, 變換路由
  const activeChange = (e) => {
    setActiveTab(e) // 立即切換 tab UI
    window.history.pushState(null, '', `/${e}`) // 修改 URL，但不跳轉、不刷新
  }

  return (
    <div
      id={`${styles['login-container']}`}
      // style={{ backgroundImage: bg_img }}
    >
      <div className={`${styles['login-header']}`}>
        <h1>歡迎回來</h1>
        <p>登入您的帳戶以享受完整的購物體驗</p>
      </div>
      <ul
        className={`${styles['nav nav-tabs']} nav nav-tabs`}
        id={styles.loginTabs}
        role="tablist"
      >
        <li className={`${styles['nav-item']} nav-item`} role="presentation">
          <button
            className={`${styles['nav-link']} nav-link ${
              activeTab === 'login' ? 'active' : ''
            } `}
            id="login-tab"
            data-bs-toggle="tab"
            data-bs-target="#login"
            type="button"
            role="tab"
            aria-controls="login"
            aria-selected="true"
            onClick={() => activeChange('login')}
          >
            登入
          </button>
        </li>
        <li className={`${styles['nav-item']} nav-item`} role="presentation">
          <button
            className={`${styles['nav-link']} nav-link ${
              activeTab === 'register' ? 'active' : ''
            }`}
            id="register-tab"
            data-bs-toggle="tab"
            data-bs-target="#register"
            type="button"
            role="tab"
            aria-controls="register"
            aria-selected="false"
            onClick={() => activeChange('register')}
          >
            註冊
          </button>
        </li>
      </ul>
      <div className={styles['tab-content']} id="loginTabsContent">
        {/* 登入頁面 */}
        {activeTab === 'login' && <Login_module />}

        {/* 註冊頁面 */}
        {activeTab === 'register' && <Register_module />}
      </div>
    </div>
  )
}
