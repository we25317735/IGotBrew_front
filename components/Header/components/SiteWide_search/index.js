import React, { useState } from 'react'
import styles from './assets/style/nini.module.scss' // 使用 SCSS 模組
import { FaSearch } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

import 'dotenv/config.js' // .env 檔案載入(共用api部分)

// 全站搜尋
export default function SiteWide_search() {
  const [searchTerm, setSearchTerm] = useState('') // 文字搜尋
  const [searchType, setSearchType] = useState('all') // tag 標籤搜尋

  const handleSearch = (e) => {
    e.preventDefault()
    let searchTypeParam = searchType === 'all' ? 'products' : searchType
    window.location.href = `/search?q=${encodeURIComponent(
      searchTerm
    )}&type=${searchTypeParam}`
  }

  return (
    <div className={`${styles['searchFilter']}`}>
      <div
        className={`${styles['container']} ${styles['searchCenter']} container`}
      >
        <div className={`${styles['row']} row`}>
          <div className={`${styles['searchSelect']} col-2`}>
            <form action="">
              <select
                className={`${styles['form-select']} ${styles['custom-select']} form-select custom-select`}
                aria-label="Default select example"
                onChange={(e) => setSearchType(e.target.value)}
                value={searchType}
              >
                <option value="all">全站</option>
                <option value="products">商品</option>
                <option value="courses">課程</option>
                <option value="articles">文章</option>
              </select>
            </form>
          </div>
          <div className={`${styles['searchInput']} col-6`}>
            <div className={`input-group`}>
              <form
                onSubmit={handleSearch}
                className={`${styles['searchGroup']} d-flex`}
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${styles['form-control']} form-control`}
                  placeholder="關鍵字：咖啡豆、在家也能學拉花..."
                  aria-label="searchInput"
                  aria-describedby="button-addon2"
                />
                <button
                  className={`${styles['btn']} ${styles['searchButton']} btn`}
                  type="submit"
                  id="button-addon2"
                >
                  <FaSearch className={`${styles['fa-magnifying-glass']}`} />
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className={`${styles['searchClose']}`}>
          <label htmlFor="searchSwitch" aria-label="搜尋切換">
            <IoClose className={`${styles['fa-xmark']}`} />
          </label>
        </div>
        <div className={`${styles['row']} row`}>
          <div className={`${styles['search-border']} ${styles['col']} col`} />
        </div>
        <div className={`${styles['row']} row`}>
          <div className={`${styles['searchTagTitle']} ${styles['col']} col`}>
            ＃關鍵字搜尋
          </div>
        </div>

        <div className={`${styles['searchTagGroup']} d-flex`}>
          <div className={`${styles['group1']} d-flex`}>
            <div className={`${styles['searchTag']} ${styles['tag1']}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACK_API}/search?q=新手&type=products`}
              >
                ＃新手
              </a>
            </div>
            <div className={`${styles['searchTag']} ${styles['tag2']}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACK_API}/search?q=技巧&type=products`}
              >
                ＃技巧
              </a>
            </div>
            <div className={`${styles['searchTag']} ${styles['tag3']}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACK_API}/search?q=咖啡豆&type=products`}
              >
                ＃咖啡豆
              </a>
            </div>
            <div className={`${styles['searchTag']} ${styles['tag4']}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACK_API}/search?q=咖啡機&type=products`}
              >
                ＃咖啡機
              </a>
            </div>
            <div className={`${styles['searchTag']} ${styles['tag5']}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACK_API}/search?q=配件&type=products`}
              >
                ＃配件
              </a>
            </div>
          </div>

          <div className={`${styles['group2']} d-flex`}>
            <div className={`${styles['searchTag']} ${styles['tag6']}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACK_API}/search?q=SCA&type=products`}
              >
                ＃SCA
              </a>
            </div>
            <div className={`${styles['searchTag']} ${styles['tag7']}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACK_API}/search?q=體驗&type=products`}
              >
                ＃體驗
              </a>
            </div>
            <div className={`${styles['searchTag']} ${styles['tag8']}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACK_API}/search?q=LATTE ART&type=products`}
              >
                ＃LATTE ART
              </a>
            </div>
            <div className={`${styles['searchTag']} ${styles['tag9']}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACK_API}/search?q=烘焙&type=products`}
              >
                ＃烘焙
              </a>
            </div>
            <div className={`${styles['searchTag']} ${styles['tag10']}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACK_API}/search?q=手沖&type=products`}
              >
                ＃手沖
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
