import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '@/styles/courseDetail.module.scss'
import Swal from 'sweetalert2'
import { FaHeart, FaCartShopping } from 'react-icons/fa6'
import { FaTrashAlt, FaAngleUp } from 'react-icons/fa'
import useCourseApi from '../../services/courseApi'
import axios from 'axios'
import Loading from '@/components/Loading'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
import moment from 'moment'

//mui
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// 取出當前使用者
import { useAuth } from '@/hooks/use-auth'

export default function CourseDetail() {
  const router = useRouter()
  const { cid, clocation, cstartDate, cendDate, cstartTime, cendTime } =
    router.query
  const {
    courses,
    schedule,
    location,
    teachers,
    fetchUserFavorites,
    fetchCourseReviews,
  } = useCourseApi()

  const [courseData, setCourseData] = useState(null)
  const [filteredSchedules, setFilteredSchedules] = useState([])
  const [teacherData, setTeacherData] = useState(null)
  const [totalQuota, setTotalQuota] = useState(0)
  const [currentQuota, setCurrentQuota] = useState(0)
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const cartHook = useCart()

  const { auth, setAuth, handleCheckAuth } = useAuth() // 使用者部分

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth, router])

  //收藏判定
  const [likedCourses, setLikedCourses] = useState([])
  useEffect(() => {
    if (auth.isAuth) {
      fetchUserFavorites(auth.userData.id).then((favorites) => {
        setLikedCourses(favorites)
      })
    }
  }, [auth.isAuth])
  const [showButton, setShowButton] = useState(false)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      console.log('ScrollTop:', scrollTop)
      setShowButton(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (router.isReady && courseData && schedule.length > 0) {
      // 根據 URL 中的參數設置地點
      if (clocation) {
        setCourseLocate(clocation)
        const selectedLocation = location.find(
          (loc) => loc.id === parseInt(clocation)
        )
        if (selectedLocation) {
          setCourseLocateText(selectedLocation.location.split(' ')[0])
        }
      }

      // 根據 URL 中的參數設置排程時間
      if (cstartDate && cendDate && cstartTime && cendTime) {
        const selectedSchedule = schedule.find(
          (item) =>
            item.course_id === courseData.id &&
            item.location_id === parseInt(clocation) &&
            moment(item.start_date).format('YYYY-MM-DD') === cstartDate &&
            moment(item.start_time, 'HH:mm').format('HH:mm') === cstartTime && // 格式化時間去除秒數
            moment(item.end_date).format('YYYY-MM-DD') === cendDate &&
            moment(item.end_time, 'HH:mm').format('HH:mm') === cendTime // 格式化時間去除秒數
        )

        if (selectedSchedule) {
          // 如果匹配到 URL 中的排程，則設置為選中的排程
          setDateButton(selectedSchedule.id)
          setCurrentQuota(selectedSchedule.quota)

          const formattedDate =
            cstartDate === cendDate
              ? `${cstartDate}`
              : `${cstartDate}~${cendDate.slice(5)}`

          const formattedTime = `${cstartTime
            .split(':')
            .slice(0, 2)
            .join(':')}~${cendTime.split(':').slice(0, 2).join(':')}`

          const scheduleTime = `${formattedDate} ${formattedTime}`
          setSelectedScheduleTime(scheduleTime)
        } else {
          // 如果沒有匹配到指定的排程，則選擇第一個排程
          const firstSchedule = schedule.find(
            (item) =>
              item.course_id === courseData.id &&
              item.location_id === parseInt(clocation)
          )
          if (firstSchedule) {
            setDateButton(firstSchedule.id)
            setCurrentQuota(firstSchedule.quota)

            const formattedDate =
              firstSchedule.start_date.split('T')[0] ===
              firstSchedule.end_date.split('T')[0]
                ? `${firstSchedule.start_date.split('T')[0]}`
                : `${
                    firstSchedule.start_date.split('T')[0]
                  }~${firstSchedule.end_date.split('T')[0].slice(5)}`
            const formattedTime = `${firstSchedule.start_time
              .split(':')
              .slice(0, 2)
              .join(':')}~${firstSchedule.end_time
              .split(':')
              .slice(0, 2)
              .join(':')}`

            const fullScheduleTime = `${formattedDate} ${formattedTime}`
            setSelectedScheduleTime(fullScheduleTime)
          }
        }
      }
      console.log('Schedule Data:', schedule)
    }
  }, [
    router.isReady,
    clocation,
    cstartDate,
    cendDate,
    cstartTime,
    cendTime,
    courseData,
    schedule,
  ])
  // 數量增減
  const [count, setCount] = useState(1)
  const handleDecrease = () => {
    setCount((prevCount) => Math.max(prevCount - 1, 1))
  }
  const handleIncrease = () => {
    if (count >= currentQuota) {
      Swal.fire({
        icon: 'warning',
        title: '已達課程人數上限',
        showConfirmButton: false,
        timer: 1000,
      })
    } else {
      setCount((prevCount) => prevCount + 1)
    }
  }

  // 地點選擇
  const [courseLocate, setCourseLocate] = useState('')
  const [courseLocateText, setCourseLocateText] = useState('')
  // 地點選擇
  const handleChangeLocate = (e) => {
    const selectedId = e.target.value
    setCourseLocate(selectedId)

    // 找到選擇的地點文字
    const selectedLocation = location.find((loc) => loc.id === selectedId)
    const locationText = selectedLocation
      ? `${selectedLocation.location.split(' ')[0]}`
      : ''
    setCourseLocateText(locationText)

    // 自動選擇第一個可用時間並更新狀態
    const schedules = schedule.filter(
      (item) =>
        item.course_id === courseData.id &&
        item.location_id === parseInt(selectedId)
    )

    if (schedules.length > 0) {
      const firstSchedule = schedules[0]
      setDateButton(firstSchedule.id)
      setCurrentQuota(firstSchedule.quota)

      // 設置選擇的時間格式值
      const formattedDate =
        firstSchedule.start_date.split('T')[0] ===
        firstSchedule.end_date.split('T')[0]
          ? `${firstSchedule.start_date.split('T')[0]}`
          : `${firstSchedule.start_date.split('T')[0]}~${firstSchedule.end_date
              .split('T')[0]
              .slice(5)}`
      const formattedTime = `${firstSchedule.start_time
        .split(':')
        .slice(0, 2)
        .join(':')}~${firstSchedule.end_time.split(':').slice(0, 2).join(':')}`

      const fullScheduleTime = `${formattedDate} ${formattedTime}`
      setSelectedScheduleTime(fullScheduleTime)
    } else {
      setDateButton(null)
      setCurrentQuota(totalQuota)
      setSelectedScheduleTime('') // 重置時間選擇
    }
  }
  useEffect(() => {
    if (courseLocate && courseLocateText) {
      console.log('Updated Location:', courseLocateText)
    }
  }, [courseLocate, courseLocateText])

  // 上課時間擇一
  const [dateButton, setDateButton] = useState(null)
  const [selectedScheduleTime, setSelectedScheduleTime] = useState('')
  const handleButtonClick = (buttonIndex) => {
    setDateButton(buttonIndex)
    const selectedSchedule = filteredSchedules.find(
      (item) => item.id === buttonIndex
    )
    setCurrentQuota(selectedSchedule.quota)
    // 保存選擇的時間格式值
    const formattedDate =
      selectedSchedule.start_date.split('T')[0] ===
      selectedSchedule.end_date.split('T')[0]
        ? `${selectedSchedule.start_date.split('T')[0]}`
        : `${
            selectedSchedule.start_date.split('T')[0]
          }~${selectedSchedule.end_date.split('T')[0].slice(5)}`
    const formattedTime = `${selectedSchedule.start_time
      .split(':')
      .slice(0, 2)
      .join(':')}~${selectedSchedule.end_time.split(':').slice(0, 2).join(':')}`

    const fullScheduleTime = `${formattedDate} ${formattedTime}`

    console.log('Selected Schedule Time:', fullScheduleTime)

    // 更新狀態
    setSelectedScheduleTime(fullScheduleTime)
  }

  // 照片擇一
  const [activeImage, setActiveImage] = useState(1)
  const [mainImageSrc, setMainImageSrc] = useState('')

  const handleImageClick = (index, src) => {
    setActiveImage(index)
    setMainImageSrc(src)
  }
  //匯入老師及介紹圖片
  useEffect(() => {
    if (router.isReady && cid && courses.length > 0) {
      const selectedCourse = courses.find(
        (course) => course.id === parseInt(cid)
      )
      setCourseData(selectedCourse)

      if (selectedCourse) {
        setMainImageSrc(selectedCourse.img_1)
        const selectedTeacher = teachers.find(
          (teacher) => teacher.id === selectedCourse.teacher_id
        )
        setTeacherData(selectedTeacher)

        getRecommendedCourses(selectedCourse.tag1, selectedCourse.tag2)
      }
      // console.log('Selected Course:', selectedCourse)
    }
  }, [cid, courses, teachers, router.isReady])

  //推薦課程
  const getRecommendedCourses = (tag1, tag2) => {
    const filteredCourses = courses.filter(
      (course) =>
        course.id !== parseInt(cid) &&
        (course.tag1 === tag1 || course.tag2 === tag2)
    )

    const shuffledCourses = filteredCourses.sort(() => 0.5 - Math.random())

    const updateRecommendedCourses = () => {
      let numRecommendations
      if (window.innerWidth < 768) {
        numRecommendations = 4
      } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
        numRecommendations = 3
      } else {
        numRecommendations = 4
      }
      setRecommendedCourses(shuffledCourses.slice(0, numRecommendations))
    }

    window.addEventListener('resize', updateRecommendedCourses)

    updateRecommendedCourses()

    return () => {
      window.removeEventListener('resize', updateRecommendedCourses)
    }
  }

  //在未選取課程時的名額加總
  useEffect(() => {
    if (courseData && schedule.length > 0) {
      const relatedSchedules = schedule.filter(
        (item) => item.course_id === courseData.id
      )
      const total = relatedSchedules.reduce((acc, curr) => acc + curr.quota, 0)
      setTotalQuota(total)
      setCurrentQuota(total)
    }
  }, [courseData, schedule])

  //個個排程的名額地點
  useEffect(() => {
    if (courseData && courseLocate && schedule.length > 0) {
      const schedules = schedule.filter(
        (item) =>
          item.course_id === courseData.id &&
          item.location_id === parseInt(courseLocate)
      )
      setFilteredSchedules(schedules)
      if (schedules.length > 0) {
        setDateButton(schedules[0].id)
        setCurrentQuota(schedules[0].quota)
      } else {
        setDateButton(null)
        setCurrentQuota(totalQuota)
      }
    }
  }, [courseData, courseLocate, schedule, totalQuota])

  //收藏
  const handleLikeToggle = async (courseId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_API}/course/favorite`,
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
  //評論
  const [courseReviews, setCourseReviews] = useState([])
  const [newReview, setNewReview] = useState('')
  // 新增評論

  const createReview = async (reviewData) => {
    try {
      console.log('正在提交評論:', reviewData)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_API}/course/review`,
        reviewData
      )
      console.log('評論提交成功:', res.data)
      setCourseReviews((prev) => [...prev, res.data])
      return res.data
    } catch (err) {
      console.error('新增評論失敗:', err.response?.data || err.message)
      throw err
    }
  }

  useEffect(() => {
    if (router.isReady && cid) {
      fetchCourseReviews(cid).then((reviews) => {
        // console.log('獲取到的評論:', reviews)
        setCourseReviews(reviews)
      })
    }
  }, [cid, router.isReady])

  const handleSubmitReview = async () => {
    if (!auth.isAuth) {
      // 提示用戶需要登錄
      Swal.fire({
        icon: 'error',
        title: '請先登入',
        position: 'top',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    const reviewData = {
      user_id: auth.userData.id,
      user_review: newReview,
      course_id: cid,
    }

    console.log('提交評論:', reviewData) // 確認輸出日誌

    try {
      await createReview(reviewData) // 這裡不需要再傳遞 cid
      // 重新獲取評論
      const updatedReviews = await fetchCourseReviews(cid)
      setCourseReviews(updatedReviews)
      setNewReview('') // 清空輸入框
    } catch (error) {
      // console.error('提交評論失敗:', error.response?.data || error.message)
      Swal.fire({
        icon: 'error',
        title: '新增評論失敗',
        position: 'top',
        showConfirmButton: false,
        timer: 1000,
      })
    }
  }

  // 刪除評論的處理函數
  const handleDeleteReview = async (reviewId) => {
    try {
      const result = await Swal.fire({
        title: '確定要刪除這條評論嗎?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '刪除',
        confirmButtonColor: '#2b4f61',
        cancelButtonText: '取消',
        customClass: {
          confirmButton: 'swal2-confirm-custom',
          cancelButton: 'swal2-cancel-custom',
        },
        didOpen: () => {
          const confirmBtn = document.querySelector('.swal2-confirm-custom')
          const cancelBtn = document.querySelector('.swal2-cancel-custom')

          if (confirmBtn) {
            confirmBtn.style.fontSize = '1.2rem'
            confirmBtn.style.padding = '7px 18px'
          }

          if (cancelBtn) {
            cancelBtn.style.fontSize = '1.2rem'
            cancelBtn.style.padding = '7px 18px'
          }
        },
      })

      if (result.isConfirmed) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACK_API}/course/review/${reviewId}`
        )
        setCourseReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewId)
        )
        Swal.fire({
          title: '刪除成功',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        })
      }
    } catch (error) {
      Swal.fire({
        title: '刪除失敗',
        icon: 'error',
        showConfirmButton: false,
        timer: 1000,
      })
    }
  }
  //loading
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  if (!courseData) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  const {
    img_main,
    name,
    tag1_name,
    tag2_name,
    price,
    content,
    img_1,
    img_2,
    img_3,
  } = courseData || {}
  // console.log(courseData)
  // console.log(cid)
  // console.log(courses)

  //購物車待用
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (
      !courseLocateText ||
      filteredSchedules.length === 0 ||
      !selectedScheduleTime
    ) {
      Swal.fire({
        title: '請選擇有效的時間與地點',
        icon: 'warning',
        position: 'top',
        showConfirmButton: false,
        timer: 1000,
        toast: true,
        color: '#1b3947',
        customClass: {
          popup: 'swal2-custom-popup',
          title: 'swal2-custom-title',
        },
        didOpen: () => {
          const popup = document.querySelector('.swal2-custom-popup')
          if (popup) {
            popup.style.top = '38px'
            popup.style.fontSize = '1.2rem'
          }
        },
      })
      return // 阻止後續操作
    }

    // console.log('Adding to cart with location:', courseLocateText)
    // console.log('Adding to cart with schedule:', selectedScheduleTime)

    const cartItem = {
      id: courseData.id,
      name: courseData.name,
      img: courseData.img_main,
      price: courseData.price,
      location: courseLocateText,
      schedule: selectedScheduleTime,
      qty: count,
    }
    let cart = JSON.parse(localStorage.getItem('CourseCart')) || []

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.location === cartItem.location &&
        item.schedule === cartItem.schedule
    )

    if (existingItemIndex >= 0) {
      // 如果存在相同課程則增加數量
      console.log('Item exists in cart. Increasing quantity.')
      cart[existingItemIndex].qty += count
    } else {
      // 否則新加到購物車
      console.log('Item does not exist in cart. Adding new item.')
      cart.push(cartItem)
    }

    localStorage.setItem('CourseCart', JSON.stringify(cart))
    console.log('Existing item index:', existingItemIndex)
    // useCart
    cartHook.handleAdd1(cartItem)
    Swal.fire({
      title: '已加入購物車',
      icon: 'success',
      position: 'top',
      showConfirmButton: false,
      timer: 1000,
      toast: true,
      color: '#1b3947',
      customClass: {
        popup: 'swal2-custom-popup',
        title: 'swal2-custom-title',
      },
      didOpen: () => {
        const popup = document.querySelector('.swal2-custom-popup')
        if (popup) {
          popup.style.top = '38px'
          popup.style.fontSize = '1.2rem'
        }
      },
    })
  }

  return (
    <>
      <Header />
      <div className={`container-fluid ${styles.courseFluidDetails}`}>
        <div className={styles.bgup}>
          <Image
            src={
              '${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/coffee up1.png'
            }
            alt=""
            width={2500}
            height={1400}
          />
        </div>
        <div className={styles.bgm}>
          <Image
            src={'${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/wave2.png'}
            alt=""
            width={3500}
            height={800}
          />
        </div>
        <div className={`${styles.courseDetails} container`}>
          <nav
            aria-label="breadcrumb"
            className={`${styles['course-breadcrumb']}`}
            style={{
              '--bs-breadcrumb-divider': "'>'",
            }}
          >
            <ol className="breadcrumb">
              <li className={`${styles['breadcrumb-item']} breadcrumb-item`}>
                <Link href="/IGotBrew">首頁</Link>
              </li>
              <li className={`${styles['breadcrumb-item']} breadcrumb-item`}>
                <Link href="/course">咖啡人的必修課</Link>
              </li>
              <li
                aria-current="page"
                className={`${styles['breadcrumb-item']} ${styles['active']} breadcrumb-item active`}
              >
                {name}
              </li>
            </ol>
          </nav>
          <div className={styles.cdSection1}>
            <div className={styles.cds1Img}>
              <Image
                src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/${img_main}`}
                alt={name}
                width={500}
                height={500}
              />
            </div>
            <div className={styles.cds1Cont}>
              <div className={styles.cds1Contup}>
                <div className={styles.contName}>
                  {name}
                  <div
                    className={styles.courseLike}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      handleLikeToggle(courseData.id)
                      e.preventDefault() // 阻止默認行為
                      e.stopPropagation() // 阻止事件冒泡
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleLikeToggle(courseData.id)
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'end',
                      marginRight: '12px',
                    }}
                  >
                    {courseData && (
                      <FaHeart
                        style={{
                          color: likedCourses.includes(courseData.id)
                            ? 'red'
                            : 'gray',
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.contTags}>
                  <a href="" className={styles.contTag}>
                    #<span>{tag1_name}</span>
                  </a>
                  <a href="" className={styles.contTag}>
                    #<span>{tag2_name}</span>
                  </a>
                </div>
                <div className={styles.contPrice}>
                  $ <span>{price?.toLocaleString()}</span>
                </div>
                <div className={styles.contQuote}>
                  名額 <span>{currentQuota}</span>
                </div>
              </div>
              <div className={styles.cds1Chosup}>
                <div className={styles.chosLoc}>
                  上課地點
                  <div className={styles.locSelect}>
                    <Box sx={{ m: 1, minWidth: 100 }}>
                      <FormControl fullWidth>
                        <InputLabel
                          id="courseLocation"
                          className={styles.courseLocate}
                          sx={{
                            color: '#2b4f61',
                            '&.Mui-focused': {
                              color: '#2b4f61',
                            },
                          }}
                        >
                          選擇
                        </InputLabel>
                        <Select
                          labelId="courseLocation"
                          id="courseLocationSelect"
                          value={courseLocate}
                          label="地點"
                          onChange={handleChangeLocate}
                          className={styles.locateSelect}
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
                          {location.map((loc) => (
                            <MenuItem
                              key={loc.id}
                              value={loc.id}
                              className={styles.customMenuItem}
                              sx={{ fontSize: '1.2rem' }}
                            >
                              {loc.area} - {loc.location}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                </div>
                <div className={styles.chosDate}>
                  上課時間
                  <div className={styles.dateBar}>
                    {filteredSchedules.length > 0 ? (
                      filteredSchedules.map((schedule) => (
                        <button
                          key={schedule.id}
                          value={selectedScheduleTime}
                          className={`${styles.cbtn} ${
                            dateButton === schedule.id ? styles.activeBtn : ''
                          }`}
                          onClick={() => handleButtonClick(schedule.id)}
                        >
                          {schedule.start_date.split('T')[0] ===
                          schedule.end_date.split('T')[0]
                            ? `${schedule.start_date.split('T')[0]}`
                            : `${
                                schedule.start_date.split('T')[0]
                              }~${schedule.end_date.split('T')[0].slice(5)}`}
                          <br />
                          {`${schedule.start_time
                            .split(':')
                            .slice(0, 2)
                            .join(':')}~${schedule.end_time
                            .split(':')
                            .slice(0, 2)
                            .join(':')}`}
                        </button>
                      ))
                    ) : (
                      <button
                        className={`${styles.cbtn} ${styles.cbtnDisabled}`}
                        disabled
                      >
                        尚無課程
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.cds1Contdown}>
                <div className={styles.contCart}>
                  <div className={styles.cartAmount}>
                    <button className={styles.minus} onClick={handleDecrease}>
                      -
                    </button>
                    <input type="text" value={count} readOnly />
                    <button className={styles.plus} onClick={handleIncrease}>
                      +
                    </button>
                  </div>
                  <a
                    href=""
                    className={styles.cartIcon}
                    onClick={handleAddToCart}
                  >
                    加入購物車 <FaCartShopping />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cdSection2}>
            <div className={styles.cds2Left}>
              課程簡介
              <div className={styles.cds2Description}>
                <br />
                {content}
              </div>
            </div>
            <div className={styles.cds2Right}>
              <div className={styles.cds2Mainpic}>
                {mainImageSrc && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/${mainImageSrc}`}
                    alt=""
                    width={500}
                    height={500}
                  />
                )}
              </div>
              <div className={styles.cds2Chospics}>
                <button
                  className={`${styles.cds2p} ${styles.cds2P1} ${
                    activeImage === 1 ? styles.active : ''
                  }`}
                  onClick={() => handleImageClick(1, img_1)}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/${img_1}`}
                    alt=""
                    width={100}
                    height={100}
                  />
                </button>
                <button
                  className={`${styles.cds2p} ${styles.cds2P2} ${
                    activeImage === 2 ? styles.active : ''
                  }`}
                  onClick={() => handleImageClick(2, img_2)}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/${img_2}`}
                    alt=""
                    width={100}
                    height={100}
                  />
                </button>
                <button
                  className={`${styles.cds2p} ${styles.cds3P3} ${
                    activeImage === 3 ? styles.active : ''
                  }`}
                  onClick={() => handleImageClick(3, img_3)}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/${img_3}`}
                    alt=""
                    width={100}
                    height={100}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className={styles.cdSection3}>
            <div className={styles.cds3Tinfo}>
              講師介紹
              <div className={styles.tinfoName}>{teacherData?.name}</div>
              <Image
                src={`${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/${teacherData?.img}`}
                alt={teacherData?.name}
                width={200}
                height={200}
              />
            </div>
            <div className={styles.cds3Tdetail}>
              <div className={styles.cds3Cert}>
                咖啡認證
                <div className={styles.certDe}>
                  <br />
                  {teacherData?.exp1.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className={styles.cds3Exp}>
                其他經歷
                <div className={styles.expDe}>
                  <br />
                  {teacherData?.exp2.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cdSection4}>
            學生課後感想
            <div className={styles.cds4thtotal}>
              共<span> {courseReviews.length} </span>
              則評論
            </div>
            <div className={styles.cds4Studs}>
              {courseReviews.length > 0 ? (
                courseReviews.map((review, index) => (
                  <div key={index} className={styles.studThought}>
                    <div className={styles.thoImg}>
                      <Image
                        src={
                          review.user_img !== 'none'
                            ? `${process.env.NEXT_PUBLIC_BACK_IMG}/images/user/${review.user_img}`
                            : `${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/defaultauth.userData.png`
                        }
                        alt={review.user_name}
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className={styles.thoDetail} style={{ width: '90%' }}>
                      <div
                        className={styles.thoName}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '4px',
                          alignItems: 'center',
                        }}
                      >
                        {auth.userData?.id == review.user_id ? (
                          <div
                            style={{
                              marginBottom: '4px',
                              fontSize: '1.4rem',
                            }}
                          >
                            你
                          </div>
                        ) : (
                          <div
                            style={{
                              marginBottom: '4px',
                              fontSize: '1.4rem',
                            }}
                          >
                            {review.user_name}
                          </div>
                        )}
                        {auth.userData?.id === review.user_id && (
                          <button
                            className={styles.thoActions}
                            onClick={() => handleDeleteReview(review.id)}
                            style={{
                              border: 'none',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <FaTrashAlt
                              style={{
                                marginLeft: '4px',
                                color: 'red',
                              }}
                            />
                          </button>
                        )}
                      </div>

                      <div
                        className={styles.thoCon}
                        style={{ fontSize: '1.2rem' }}
                      >
                        {review.user_review}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className={styles.studThought}
                  style={{ fontSize: '1.2rem' }}
                >
                  目前這個課程還沒有任何評論
                </div>
              )}
            </div>
            <div className={styles.cds4Self}>
              <div className={styles.selfThought}>
                <div className={styles.thoImg}>
                  <Image
                    src={
                      auth.userData?.img
                        ? `${process.env.NEXT_PUBLIC_BACK_IMG}/images/user/${auth.userData.img}`
                        : '${process.env.NEXT_PUBLIC_BACK_IMG}/images/course/defaultauth.userData.png'
                    }
                    alt={auth.userData?.name}
                    width={50}
                    height={50}
                  />
                </div>
                <div
                  className={styles.thoCon}
                  style={{ fontSize: '1.4rem', marginLeft: '12px' }}
                >
                  你的感想
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      gap: '4px',
                      height: '30px',
                      fontSize: '1.2rem',
                    }}
                  >
                    <textarea
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder="發表你的評論..."
                      style={{ width: '96%' }}
                    />
                    <button
                      onClick={handleSubmitReview}
                      className={'btn'}
                      style={{
                        border: '1px solid #2b4f61',
                        backgroundColor: '#b3c0c6',
                        fontSize: '1.2rem',
                        textWrap: 'nowrap',
                        '&:hover': {
                          color: '#ffffff',
                          background: '#2b4f61',
                          borderColor: '#2b4f61',
                        },
                      }}
                    >
                      提交評論
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.cdSection5}>
            相關課程推薦
            <div className={`${styles.cmainCards} row`}>
              {recommendedCourses.map((course) => (
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
              ))}
            </div>
          </div>
        </div>
        {showButton && (
          <button onClick={scrollToTop} className={`${styles.gototop} btn`}>
            <FaAngleUp />
            <br /> Top
          </button>
        )}

        <Footer />
      </div>
    </>
  )
}
