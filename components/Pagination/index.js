import React from 'react'
// 導入 React 庫以使用其組件功能

import styles from './assets/style/style.module.scss'
// 導入 SCSS 模塊，樣式將應用於此元件

import { useSelector, useDispatch } from 'react-redux'
// 從 react-redux 庫中導入 useSelector 和 useDispatch 鉤子
// useSelector 用於從 Redux store 中選取狀態
// useDispatch 用於獲取 dispatch 函數以發送 action

import { setCurrentPage } from '@/redux/slices/paginationSlice'
// 導入設置當前頁面的 action 創建器，這會更新 Redux 中的分頁狀態

// 定義並導出分頁元件
export default function Pagination() {
  const dispatch = useDispatch()
  // 獲取 dispatch 函數，用於發送 Redux action

  const { total, currentPage } = useSelector((state) => state.pagination)
  // 從 Redux store 中選取 pagination 狀態，獲取總頁數和當前頁碼

  const handlePageClick = (page) => {
    dispatch(setCurrentPage(page))
  }
  // 處理頁碼點擊事件的函數，接受頁碼作為參數
  // 使用 dispatch 發送 setCurrentPage action 來更新當前頁碼

  const getPageNumbers = () => {
    const maxButtons = 5 // 定義最多顯示的頁碼按鈕數量
    const halfMax = Math.floor(maxButtons / 2)
    // 計算一半的按鈕數量，用於確定當前頁碼的兩側顯示範圍
    let startPage, endPage // 定義起始頁和結束頁變量

    if (total <= maxButtons) {
      startPage = 1
      endPage = total
    } else if (currentPage <= halfMax) {
      startPage = 1
      endPage = maxButtons
    } else if (currentPage + halfMax >= total) {
      startPage = total - maxButtons + 1
      endPage = total
    } else {
      startPage = currentPage - halfMax
      endPage = currentPage + halfMax
    }
    // 根據總頁數和當前頁碼確定起始頁和結束頁的邏輯
    // 如果總頁數小於等於最大按鈕數量，顯示所有頁碼
    // 如果當前頁碼接近開頭，從1顯示到最大按鈕數量
    // 如果當前頁碼接近末尾，顯示末尾的最大按鈕數量
    // 否則，顯示當前頁碼的兩側範圍

    const pages = []

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    // 創建一個頁碼陣列，從起始頁到結束頁

    return pages
  }

  const pages = getPageNumbers()
  // 調用 getPageNumbers 函數獲取需要顯示的頁碼

  return (
    <div className={styles.pagination}>
      {/* 分頁元件的容器，應用了 pagination 樣式 */}

      <a href="#" onClick={() => handlePageClick(1)}>
        <i className={`fa-solid fa-angles-left ${styles.grayer}`}></i>
      </a>
      {/* 第一頁的快速跳轉按鈕，圖示為雙左箭頭 */}

      <a
        href="#"
        onClick={() =>
          handlePageClick(currentPage > 1 ? currentPage - 1 : currentPage)
        }
      >
        <i className={`fa-solid fa-angle-left ${styles.grayer}`}></i>
      </a>
      {/* 上一頁的按鈕，圖示為單左箭頭
          如果當前頁碼大於1，則頁碼減1，否則保持不變 */}

      {pages.map((page) => (
        <a
          key={page}
          href="#"
          className={page === currentPage ? styles.selected : ''}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </a>
      ))}
      {/* 動態生成頁碼按鈕
          根據 pages 陣列生成對應的頁碼按鈕
          當前頁碼的按鈕應用 selected 樣式 */}

      <a
        href="#"
        onClick={() =>
          handlePageClick(currentPage < total ? currentPage + 1 : currentPage)
        }
      >
        <i className="fa-solid fa-angle-right"></i>
      </a>
      {/* 下一頁的按鈕，圖示為單右箭頭
          如果當前頁碼小於總頁數，則頁碼加1，否則保持不變 */}

      <a href="#" onClick={() => handlePageClick(total)}>
        <i className="fa-solid fa-angles-right"></i>
      </a>
      {/* 最後一頁的快速跳轉按鈕，圖示為雙右箭頭 */}
    </div>
  )
}
