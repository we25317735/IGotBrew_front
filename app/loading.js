'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import coffeeloading from '../assets/coffee loading.json'

// ⚡ client-only 載入，避免 SSR 報錯
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div className="fallback">Loading...</div>, // fallback (可改 spinner)
})

export default function Loading() {
  return (
    <>
      <div id="Loading">
        <div className="talk-img">
          <Lottie
            animationData={coffeeloading}
            loop={true}
            autoplay={true}
            style={{ height: 400, width: 800 }}
          />
        </div>
      </div>

      <style jsx>{`
        #Loading {
          background: #eee9e4;
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          z-index: 99;
          top: 0;
          left: 0;
        }

        .talk-img {
          width: 500px;
          height: 250px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .fallback {
          font-size: 2rem;
          color: rgba(0, 0, 0, 0.5);
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }

        h1 {
          font-size: 5rem;
          color: rgba(0, 0, 0, 0.427);
          display: flex;
          align-items: center;
        }

        h1 span {
          display: inline-block;
          animation: wave 1.5s infinite;
        }

        h1 span:nth-child(1) {
          animation-delay: 0s;
        }

        h1 span:nth-child(2) {
          animation-delay: 0.3s;
        }

        h1 span:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes wave {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </>
  )
}
