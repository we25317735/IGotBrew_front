import React from 'react'
import useFirebase from '@/hooks/use-firebase'
import { FaGithub } from 'react-icons/fa'

/**
   Github Developer 聲請: https://github.com/settings/developers
 */

export default function GitHub_btn() {
  const { loginGithub } = useFirebase()

  const callbackGithubLoginPopup = async (providerData) => {
    console.log('Github 回傳: ', providerData)
  }

  return (
    <button
      className="btn d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: '#fff',
        color: '#333', // GitHub 黑色
        padding: '8px',
        border: '1px solid #333', // GitHub 黑色邊框
        borderRadius: '10px',
        width: '50px',
        height: '50px',
        fontSize: '24px',
      }}
      onClick={() => loginGithub(callbackGithubLoginPopup)}
    >
      <FaGithub />
    </button>
  )
}
