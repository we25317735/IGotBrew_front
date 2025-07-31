import React, { useState, useEffect } from 'react'
import styles from '@/styles/courseCalenderFront.module.scss'
import moment from 'moment'
import { useRouter } from 'next/router'

//icon
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'

//api
import useCourseApi from '@/services/courseApi'

export default function CalenderFront() {
  //日曆
  const { courses, schedule, location, fetchSchedules } = useCourseApi()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // 加載數據
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSchedules()
      } catch (error) {
        console.error('Error fetching schedules:', error)
      }
    }

    fetchData()
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const router = useRouter()

  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })

  const handleShowDetails = (scheduleItem, event) => {
    const courseDetails = courses.find(
      (course) => course.id === scheduleItem.course_id
    )

    //判斷開始及結束日期相同與否
    const isSameDay =
      moment(scheduleItem.start_date).format('YYYY-MM-DD') ===
      moment(scheduleItem.end_date).format('YYYY-MM-DD')

    const formattedDate = isSameDay
      ? moment(scheduleItem.start_date).format('YYYY-MM-DD')
      : `${moment(scheduleItem.start_date).format('YYYY-MM-DD')} ~ ${moment(
          scheduleItem.end_date
        ).format('YYYY-MM-DD')}`

    const formattedTime = `${scheduleItem.start_time
      .split(':')
      .slice(0, 2)
      .join(':')}~${scheduleItem.end_time.split(':').slice(0, 2).join(':')}`

    const scheduleWithCourseDetails = {
      ...scheduleItem,
      price: courseDetails?.price,
      content: courseDetails?.content,
      location:
        location.find((loc) => loc.id === scheduleItem.location_id)?.location ||
        '未知地點',
      formattedDateTime: `${formattedDate} ${formattedTime}`,
    }

    const rect = event.currentTarget.getBoundingClientRect()
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    })
    setSelectedSchedule(scheduleWithCourseDetails)
  }

  const getDaySchedule = (date) => {
    if (!date) return []

    // 設置日期為當地時間的開始部分，避免跨時區導致的日期錯誤
    const dateString = moment(date).local().format('YYYY-MM-DD')

    return schedule.filter((item) => {
      const startDate = moment(item.start_date).local().format('YYYY-MM-DD')
      const endDate = moment(item.end_date).local().format('YYYY-MM-DD')

      return dateString >= startDate && dateString <= endDate
    })
  }
  //日曆上方年月格式
  const formatDate = (date) => {
    return date.toLocaleString('zh-TW', { year: 'numeric', month: 'long' })
  }
  //每個月有幾天
  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  //每個月第一天
  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentDate)
    const firstDay = firstDayOfMonth(currentDate)
    const days = []

    // 計算所需格子
    const neededCells = totalDays + firstDay <= 35 ? 35 : 42

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-start-${i}`}
          className={`${styles.calendarDay} ${styles.empty}`}
        ></div>
      )
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      )

      const daySchedule = getDaySchedule(date)
      const hasSchedule = daySchedule.length > 0
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === i &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear()

      days.push(
        <button
          key={i}
          className={`${styles.calendarDay} ${
            isSelected ? styles.selected : ''
          } ${hasSchedule ? styles.hasSchedule : ''}`}
          onClick={(event) => {
            setSelectedDate(date)
            if (hasSchedule) handleShowDetails(daySchedule[0], event)
          }}
          aria-label={`${i} ${currentDate.toLocaleString('default', {
            month: 'long',
          })} ${currentDate.getFullYear()}`}
          aria-pressed={isSelected}
        >
          <div>{i}</div>
          {daySchedule.map((scheduleItem, index) => (
            <div key={index} className={styles.scheduleItem}>
              <span>{scheduleItem.course_name}</span>
              <br />
              <span style={{ textAlign: 'start' }}>
                上午 {scheduleItem.start_time.split(':').slice(0, 2).join(':')}
              </span>
            </div>
          ))}
        </button>
      )
    }

    const remainingCells = neededCells - (firstDay + totalDays)
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div
          key={`empty-end-${i}`}
          className={`${styles.calendarDay} ${styles.empty}`}
        ></div>
      )
    }
    return days
  }
  const [hoveredScheduleId, setHoveredScheduleId] = useState(null)
  const renderListView = () => {
    const days = []
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const currentMonthSchedules = schedule.filter((item) => {
      const itemDate = moment(item.start_date)
      return (
        itemDate.month() === currentMonth && itemDate.year() === currentYear
      )
    })

    // 按日期排序
    currentMonthSchedules.sort(
      (a, b) => moment(a.start_date) - moment(b.start_date)
    )

    currentMonthSchedules.forEach((scheduleItem) => {
      const scheduleDate = moment(scheduleItem.start_date)
      const isSelected =
        selectedDate &&
        scheduleDate.isSame(selectedDate, 'day') &&
        scheduleDate.isSame(selectedDate, 'month') &&
        scheduleDate.isSame(selectedDate, 'year')
      const isHovered = hoveredScheduleId === scheduleItem.id
      days.push(
        <button
          key={scheduleItem.id}
          className={`${styles.listItem} ${styles.scheduleItem}`}
          onClick={(event) => {
            setSelectedDate(scheduleDate.toDate())
            handleShowDetails(scheduleItem, event)
          }}
          onMouseEnter={() => setHoveredScheduleId(scheduleItem.id)}
          onMouseLeave={() => setHoveredScheduleId(null)}
          style={{
            fontSize: '1.2rem',
            width: '100%',
            border: isSelected ? '2px solid #eba92a' : '1px solid #2b4f61',
            backgroundColor:
              isSelected || isHovered ? '#b3c0c6' : 'transparent',
            color: isSelected || isHovered ? '#1b3947' : '#2b4f61',
            opacity: isHovered ? 0.7 : 1,
          }}
        >
          <div
            style={{
              textAlign: 'start',
              paddingLeft: '8px',
              padding: '16px 4px',
            }}
          >
            <span style={{ marginBottom: '4px' }}>
              {scheduleDate.format('M/D (ddd)')} 上午{' '}
              {scheduleItem.start_time.split(':').slice(0, 2).join(':')}
            </span>
            <br />
            <span>{scheduleItem.course_name}</span>
          </div>
        </button>
      )
    })
    // console.log('Current Date:', currentDate);
    // console.log('Current Month:', currentMonth);
    // console.log('Current Year:', currentYear);
    // console.log('All Schedules:', schedule);
    // console.log('Filtered Schedules:', currentMonthSchedules);
    return days.length > 0 ? days : <div>無課程</div>
  }

  const changeMonth = (increment) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    )
  }

  return (
    <>
      <div className={`container ${styles.calenAll}`}>
        <div className={styles.calenControll}></div>
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <button onClick={() => changeMonth(-1)}>
              <FaAngleLeft />
            </button>
            <h2>{formatDate(currentDate)}</h2>
            <button onClick={() => changeMonth(1)}>
              <FaAngleRight />
            </button>
          </div>
          {isMobile ? (
            <div className={styles.listView}>{renderListView()}</div>
          ) : (
            <>
              <div className={styles.calendarWeekdays}>
                {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                  <div key={day} className={styles.weekday}>
                    {day}
                  </div>
                ))}
              </div>
              <div className={styles.calendarBody}>{renderCalendar()}</div>
            </>
          )}
        </div>
      </div>
      {selectedSchedule && (
        <div
          className={styles.detailPopup}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className={styles.courseDetail}
            style={{ fontSize: '1.2rem', padding: '10px' }}
          >
            <button
              className={styles.closeButton}
              onClick={() => setSelectedSchedule(null)}
            >
              ×
            </button>
            <h3>{selectedSchedule.course_name}</h3>
            <p></p>
            <p>
              日期：
              {moment(selectedSchedule.start_date).isSame(
                selectedSchedule.end_date,
                'day'
              )
                ? moment(selectedSchedule.start_date).format('YYYY-MM-DD')
                : `${moment(selectedSchedule.start_date).format(
                    'YYYY-MM-DD'
                  )} ～ ${moment(selectedSchedule.end_date).format('MM-DD')}`}
            </p>
            <p>
              時間：上午{selectedSchedule.start_time} -下午
              {selectedSchedule.end_time}
            </p>
            <p>
              地點：
              {location.find((loc) => loc.id === selectedSchedule.location_id)
                ?.location || '未知地點'}
            </p>
            <p>價錢： ${selectedSchedule.price || '未提供'}</p>
            <div className={styles.moreInfo}>
              <span>
                {selectedSchedule.content
                  ? selectedSchedule.content.slice(0, 100)
                  : '無內容描述'}
              </span>
              ...
            </div>
            <button
              style={{ fontSize: '1.2rem' }}
              className={styles.registerButton}
              onClick={() =>
                router.push({
                  pathname: `/course/${selectedSchedule.course_id}`,
                  query: {
                    clocation: selectedSchedule.location_id,
                    cstartDate: moment(selectedSchedule.start_date).format(
                      'YYYY-MM-DD'
                    ),
                    cendDate: moment(selectedSchedule.end_date).format(
                      'YYYY-MM-DD'
                    ),
                    cstartTime: selectedSchedule.start_time,
                    cendTime: selectedSchedule.end_time,
                  },
                })
              }
            >
              我要報名
            </button>
          </div>
        </div>
      )}
    </>
  )
}
