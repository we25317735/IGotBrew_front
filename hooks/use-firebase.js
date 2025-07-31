import { initializeApp } from 'firebase/app'

import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  RecaptchaVerifier, //手機認證部分
  signInWithPhoneNumber,
} from 'firebase/auth'
import { useEffect } from 'react'

import { firebaseConfig } from './firebase-config'

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 *  - firebase.auth().getRedirectResult(): This promise completes when the user gets back from
 *    the auth redirect flow. It is where you can get the OAuth access token from the IDP.
 */
// 重定向專用，用於在同頁面(firebase的登入頁會與回調頁同一頁)監聽登入情況
// getRedirectResult回調頁時用(註:重定向後，回調回來時才會呼叫)
// onAuthStateChanged監聽auth物件變化 <---(用這個就足夠，它會在頁面一啟動偵測目前登入情況)
const initApp = (callback) => {
  const auth = getAuth()

  // 重定向身份驗證流程的結果。
  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        //這將為您提供一個 Google 存取權令牌。您可以使用它來存取 Google API
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken

        // 登入的用戶資訊
        const user = result.user
        console.log(token)
        console.log(user)
      }
    })
    .catch((error) => {
      console.error(error)
    })

  // 監聽身份驗證狀態變更
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('user', user)
      // 回呼用戶數據
      callback(user.providerData[0])
    }
  })
}

// TODO: 目前不需要從firebase登出，firebase登出並不會登出google
const logoutFirebase = () => {
  const auth = getAuth()

  signOut(auth)
    .then(function () {
      // 退出成功
      console.log('google 成功登出')
      // window.location.assign('https://accounts.google.com/logout')
    })
    .catch(function (error) {
      // 發生錯誤
      console.log(error)
    })
}

// google 登入
const loginGoogle = async (callback) => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user
      // console.log('firebase 給的基本資訊: ', user)

      // callback 一些 google 給的基本資料
      callback(user.providerData[0])
    })
    .catch((error) => {
      console.log(error)
    })
}

const loginGoogleRedirect = async (callback) => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  // redirect to google auth
  signInWithRedirect(auth, provider)
}

// Twitter  登入
const loginTwitter = async (callback) => {
  const provider = new TwitterAuthProvider()
  const auth = getAuth()

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user
      // console.log('登入的 hook: ', user)

      // callback 一些 google 給的基本資料
      callback(user.providerData[0])
    })
    .catch((error) => {
      console.log(error)
    })
}

// GitHub 登入
const loginGithub = async (callback) => {
  const provider = new GithubAuthProvider() // 使用 GitHub 提供者
  const auth = getAuth()

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user

      // 使用 callback 傳遞 GitHub 的基本資料
      callback(user.providerData[0])
    })
    .catch((error) => {
      console.log('GitHub 登入失敗：', error)
    })
}

// (待研究) 測試 firebase 手機認證: 發送驗證碼到用戶手機(須付費)
const loginWithPhone = async (phoneNumber) => {
  const auth = getAuth()

  console.log('使用者: ', phoneNumber)

  // 設置 reCAPTCHA 驗證器
  const recaptchaVerifier = new RecaptchaVerifier(
    auth,
    'recaptcha-container',
    {}
  )

  console.log('驗證: ', recaptchaVerifier)

  // 發送驗證碼
  signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    .then((confirmationResult) => {
      // 將 confirmationResult 存儲到全域變量，方便後續使用
      window.confirmationResult = confirmationResult
      console.log('驗證碼已發送', confirmationResult)

      // 隱藏 reCAPTCHA 元素
      document.getElementById('recaptcha-container').style.display = 'none'
    })
    .catch((error) => {
      console.error('發送驗證碼時發生錯誤:', error)
    })
}

export default function useFirebase() {
  useEffect(() => {
    // 一開始先連接到 firebase 的 Config
    initializeApp(firebaseConfig)
  }, [])

  return {
    initApp,
    loginGoogleRedirect,
    loginGoogle,
    loginTwitter,
    logoutFirebase,
    loginGithub,
    loginWithPhone,
  }
}
