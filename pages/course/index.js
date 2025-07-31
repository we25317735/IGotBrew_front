import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import cfvideo from '@/public/images/course/video/courseVideo.mp4'
import cfvideo2 from '@/public/images/course/video/courseVideo2.mp4'
import styles from '@/styles/course.module.scss'
import { FaHeart, FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import Loading from '@/components/Loading'
import CalenderFront from './calenderFront'
import Link from 'next/link'

import axios from 'axios'
import useCourseApi from '../../services/courseApi'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

//mui api
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Slider from '@mui/material/Slider'

// 取出當前使用者
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'

// .env 檔案載入(共用api部分)
import 'dotenv/config.js'

export default function Course() {
  //引入資料
  const {
    courses,
    fetchCoursesByTag,
    coursetags,
    fetchUserFavorites,
    schedule,
  } = useCourseApi()
  const router = useRouter()
  const { category } = router.query

  //左側課程類別
  const [courseCate, setCourseCate] = useState('all')
  const [courseSort, setCourseSort] = useState('')
  const [filteredCourses, setFilteredCourses] = useState(courses)

  useEffect(() => {
    if (!courseSort) {
      setCourseSort(0) // 設置預設排序為 0
    }

    if (category) {
      setCourseCate(category)
      fetchCoursesByTag(category).then((filtered) => {
        setFilteredCourses(filtered)
        setCurrentPage(1)
      })
    }
  }, [category, courseSort])
  //影片size調整
  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分
  const [videoSrc, setVideoSrc] = useState(cfvideo)
  const [likedCourses, setLikedCourses] = useState([])

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth, router])

  //處理收藏
  useEffect(() => {
    if (auth.isAuth) {
      fetchUserFavorites(auth.userData.id).then((favorites) => {
        setLikedCourses(favorites)
      })
    }
  }, [auth.isAuth])

  //768的影片切換
  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth <= 768) {
        setVideoSrc(cfvideo2)
      } else {
        setVideoSrc(cfvideo)
      }
    }
    window.addEventListener('resize', checkScreenWidth)
    window.addEventListener('load', checkScreenWidth)

    checkScreenWidth()
    return () => {
      window.removeEventListener('resize', checkScreenWidth)
      window.removeEventListener('load', checkScreenWidth)
    }
  }, [])

  //收藏
  const handleLikeToggle = async (courseId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_API}/api/course/favorite`,
        {
          user_id: auth.userData.id,
          course_id: courseId,
        }
      )
      if (response.data.status === 'success') {
        setLikedCourses((prev) =>
          prev.includes(courseId)
            ? prev.filter((id) => id !== courseId)
            : [...prev, courseId]
        )
      }
    } catch (error) {
      console.error('收藏失敗:', error)
    }
  }

  // 排序
  const handleChangeSort = (e) => {
    const sortType = e.target.value
    setCourseSort(sortType)

    let sortedCourses = [...filteredCourses] // 複製一份課程列表

    if (sortType === 0) {
      sortedCourses.sort((a, b) => a.id - b.id)
    } else if (sortType === 1) {
      sortedCourses.sort((a, b) => b.sold - a.sold)
    } else if (sortType === 2) {
      sortedCourses.sort((a, b) => {
        const aSchedule = schedule.find((item) => item.course_id === a.id)
        const bSchedule = schedule.find((item) => item.course_id === b.id)

        if (!aSchedule && !bSchedule) return 0
        if (!aSchedule) return 1
        if (!bSchedule) return -1

        const aDate = new Date(aSchedule.start_date)
        const bDate = new Date(bSchedule.start_date)

        return aDate - bDate // 按日期由早到晚排序
      })
    }

    setFilteredCourses(sortedCourses) // 更新排序後的課程列表
    setCurrentPage(1) // 重置到第一頁
  }

  //價格
  const [priceRange, setPriceRange] = useState([0, 0])
  useEffect(() => {
    if (courses.length > 0) {
      const minPrice = Math.min(...courses.map((course) => course.price))
      const maxPrice = Math.max(...courses.map((course) => course.price))
      setPriceRange([minPrice, maxPrice])
      setFilteredCourses(courses)
    }
  }, [courses])

  //類別
  const handleChangeCate = async (e) => {
    setCourseSort(0)
    const selectedCategory = e.target.value
    setCourseCate(selectedCategory)
    const filtered = await fetchCoursesByTag(selectedCategory, priceRange)
    // console.log(fetchCoursesByTag)
    setFilteredCourses(filtered)
    setCurrentPage(1)
  } //價格
  const handleChangePrice = (e, newPrice) => {
    setPriceRange(newPrice)
  }
  useEffect(() => {
    // 當類別改變時，根據類別篩選課程並動態更新價格範圍
    const filterByCategory = async () => {
      const filtered = await fetchCoursesByTag(courseCate)
      setFilteredCourses(filtered)

      // 動態設置價格範圍
      const minPrice = Math.min(...filtered.map((course) => course.price))
      const maxPrice = Math.max(...filtered.map((course) => course.price))
      setPriceRange([minPrice, maxPrice])
    }

    filterByCategory()
    setCurrentPage(1)
  }, [courseCate])

  useEffect(() => {
    // 當價格範圍改變時，重新篩選當前篩選到的課程
    const filterByPrice = () => {
      const filtered = courses.filter(
        (course) =>
          course.price >= priceRange[0] && course.price <= priceRange[1]
      )
      setFilteredCourses(filtered)
    }

    filterByPrice()
    setCurrentPage(1)
  }, [priceRange, courses])

  const handlePriceChangeCommitted = () => {
    const filtered = courses.filter(
      (course) => course.price >= priceRange[0] && course.price <= priceRange[1]
    )

    setFilteredCourses(filtered)
    setCurrentPage(1)
  }
  //https://stackoverflow.com/questions/47440051/get-material-ui-slider-value-in-ondragstop-event

  //處理分頁
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [totalPages, setTotalPages] = useState(1)
  const [displayedCourses, setDisplayedCourses] = useState([])

  useEffect(() => {
    if (filteredCourses && filteredCourses.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedCourses = filteredCourses.slice(startIndex, endIndex)
      setDisplayedCourses(paginatedCourses)
      setTotalPages(Math.ceil(filteredCourses.length / itemsPerPage))
    }
  }, [filteredCourses, currentPage])
  //實現切換頁
  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <a
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? styles.active : ''}
          href="#"
        >
          {i}
        </a>
      )
    }
    return pages
  }

  // 當前頁面
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  return (
    <>
      <Header />
      <div className={`container-fluid ${styles.coursemain} mt-5`}>
        <div className={styles.bgup}>
          <Image
            src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/coffee up1.png`}
            alt=""
            width={2500}
            height={1400}
          />
        </div>
        <div className={`container ${styles.coursemainc}`}>
          <nav
            aria-label="breadcrumb"
            className={`${styles['course-breadcrumb']} `}
            style={{
              '--bs-breadcrumb-divider': "'>'",
            }}
          >
            <ol className="breadcrumb">
              <li className={`${styles['breadcrumb-item']} breadcrumb-item`}>
                <Link href="/IGotBrew">首頁</Link>
              </li>
              <li
                aria-current="page"
                className={`${styles['breadcrumb-item']} ${styles['active']} breadcrumb-item active`}
              >
                咖啡人的必修課
              </li>
            </ol>
          </nav>
          <video
            className={`${styles.courseVideo} mt-5`}
            key={videoSrc}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className={styles.coursemainIm}>
            <div className={styles.courseFilter}>
              <div className={styles.courseFunc}>
                <div className={styles.funcDetail}>
                  <Box sx={{ m: 1, minWidth: 100 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="courseCategory"
                        className={styles.courseCategory}
                        sx={{
                          color: '#2b4f61',
                          '&.Mui-focused': {
                            color: '#fff !important',
                          },
                        }}
                      >
                        課程類別
                      </InputLabel>
                      <Select
                        labelId="courseCategory"
                        id="courseCategorySelect"
                        value={courseCate}
                        label="課程類別"
                        onChange={handleChangeCate}
                        className={styles.customSelect}
                        sx={{
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2b4f61 !important',
                          },
                          '& .MuiSelect-icon': {
                            color: '#2b4f61',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#fff',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#fff',
                          },
                        }}
                      >
                        <MenuItem
                          value="all"
                          className={styles.customMenuItem}
                          sx={{ fontSize: '1.2rem' }}
                        >
                          全部類別
                        </MenuItem>
                        {coursetags.map((tag) => (
                          <MenuItem
                            key={tag.id}
                            value={tag.id}
                            className={styles.customMenuItem}
                            sx={{ fontSize: '1.2rem' }}
                          >
                            {tag.tagname}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <div className={styles.coursePrice}>
                  <div className={styles.cpriceBarup}>價格</div>
                  <div className={styles.cpriceBardown}>
                    <Slider
                      getAriaLabel={() => 'priceRange'}
                      min={Math.min(...courses.map((course) => course.price))}
                      max={Math.max(...courses.map((course) => course.price))}
                      value={priceRange}
                      onChange={handleChangePrice}
                      onChangeCommitted={handlePriceChangeCommitted}
                      valueLabelDisplay="on"
                      getAriaValueText={(value) => `${value}`}
                      sx={{
                        m: 1,
                        minWidth: 100,
                        color: '#2b4f61',
                        display: 'flex',
                        alignSelf: 'end',
                        '& .MuiSlider-thumb': {
                          backgroundColor: '#2b4f61',
                          margin: 0,
                          width: '16px',
                          height: '16px',
                        },
                        '& .MuiSlider-track': {
                          backgroundColor: '#2b4f61',
                          margin: 0,
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: '#2b4f61',
                          margin: 0,
                        },
                        '& .MuiSlider-valueLabel': {
                          backgroundColor: 'transparent',
                          color: '#2b4f61',
                          fontSize: '1rem',
                          top: 4,
                          margin: 0,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.ccinfo}>
                <div className={styles.cmcTotal}>
                  共 <span> {filteredCourses?.length || 0}</span> 筆
                </div>
                <div className={styles.courseFilterR}>
                  <Box sx={{ m: 1, minWidth: 100 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="courseSort"
                        className={styles.courseSort}
                        sx={{
                          color: '#2b4f61',
                          '&.Mui-focused': {
                            color: '#2b4f61',
                          },
                        }}
                      >
                        排序
                      </InputLabel>
                      <Select
                        labelId="courseSort"
                        id="courseSortSelect"
                        value={courseSort}
                        label="課程排序"
                        onChange={handleChangeSort}
                        className={styles.customSelect2}
                        sx={{
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2b4f61 !important',
                          },
                          '& .MuiSelect-icon': {
                            color: '#2b4f61',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#fff',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#fff',
                          },
                        }}
                      >
                        <MenuItem
                          value={0}
                          className={styles.customMenuItem}
                          sx={{ fontSize: '1.2rem' }}
                        >
                          預設
                        </MenuItem>
                        <MenuItem
                          value={1}
                          className={styles.customMenuItem}
                          sx={{ fontSize: '1.2rem' }}
                        >
                          最熱門
                        </MenuItem>
                        <MenuItem
                          value={2}
                          className={styles.customMenuItem}
                          sx={{ fontSize: '1.2rem' }}
                        >
                          最近開課
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              </div>
            </div>
            <div className={styles.coursemainCards}>
              <div className={`${styles.cmainCards} row`}>
                {displayedCourses && displayedCourses.length > 0 ? (
                  displayedCourses.map((course) => (
                    <div key={course.id} className="col-6 col-md-4 col-lg-3">
                      <a href={`/course/${course.id}`}>
                        <div className={styles.cmainCard}>
                          <div className={styles.cmcImg}>
                            <Image
                              src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/${course.img_main}`}
                              alt={course.name}
                              width={300}
                              height={300}
                            />
                          </div>
                          <div className={styles.cmcCon}>
                            <div className={styles.cmcName}>{course.name}</div>
                            <div className={styles.cmcP}>
                              $<span>{course.price.toLocaleString()}</span>
                            </div>
                            <p>ewfwe {process.env.BACK_IMG}</p>
                          </div>
                          <div
                            className={styles.courseLike}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              handleLikeToggle(course.id)
                              e.preventDefault() // 阻止默認行為
                              e.stopPropagation() // 阻止事件冒泡
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleLikeToggle(course.id)
                              }
                            }}
                            style={{
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'end',
                              marginRight: '12px',
                            }}
                          >
                            <FaHeart
                              style={{
                                color: likedCourses.includes(course.id)
                                  ? 'red'
                                  : 'gray',
                              }}
                            />
                          </div>
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <div style={{ margin: '50px 0 150px 0' }}>
                    <p>沒有找到符合條件的課程。</p>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.pagination}>
              <a
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? styles.disabled : ''}
                href="#"
              >
                <FaAngleLeft />
              </a>
              {renderPagination()}
              <a
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? styles.disabled : ''}
                href="#"
              >
                <FaAngleRight />
              </a>
            </div>
          </div>
          <div className={styles.calendarSection}>
            <CalenderFront />
          </div>
        </div>
        <div style={{ margin: '0', width: '100vw' }}>
          <Footer />
        </div>
      </div>
    </>
  )
}
