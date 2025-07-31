import React, { useState, useEffect } from 'react'
import styles from '@/styles/courseEditorCalender.module.scss'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import moment from 'moment'

//icon
import { FaPlus, FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { FaPencilAlt, FaTrashAlt, FaEye } from 'react-icons/fa'

//api
import useCourseApi from '../../../services/courseApi'

//sweetalert
import Swal from 'sweetalert2'

//modal
import CreateSchedule from './createSchedule'
import EditSchedule from './editSchedule'

export default function Calender() {
  //日曆
  const { schedule, location, courses, deleteSchedule, fetchBackSchedules } =
    useCourseApi()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [editSchedule, setEditSchedule] = useState(null)
  // 加載數據
  useEffect(() => {
    const fetchData = async () => {
      if (schedule.length === 0) {
        try {
          await fetchBackSchedules()
        } catch (error) {
          console.error('Error fetching schedules:', error)
        }
      }
    }
    fetchData()
  }, [schedule]) // 當 `schedule` 為空時才進行資料抓取

  //日曆上方年月格式
  const formatDate = (date) => {
    return date.toLocaleString('zh-TW', { year: 'numeric', month: 'long' })
  }

  const handleShowDetails = (scheduleItem) => {
    const startDateObj = moment(scheduleItem.start_date).local().startOf('day')
    const endDateObj = moment(scheduleItem.end_date).local().startOf('day')

    const startDate = startDateObj.format('YYYY-MM-DD')
    const endDate = endDateObj.format('YYYY-MM-DD')

    const startTime = scheduleItem.start_time.split(':').slice(0, 2).join(':')
    const endTime = scheduleItem.end_time.split(':').slice(0, 2).join(':')
    const locationDetail =
      location.find((loc) => loc.id === scheduleItem.location_id)?.location ||
      ' '
    const courseValid = scheduleItem.valid ? '上架' : '下架'

    Swal.fire({
      title: `${scheduleItem.course_name}`,
      html: `
          <div style="display: flex; flex-direction: column; align-items: flex-start;font-size:1.4rem;">
            <p>地點: ${locationDetail}</p>
            <p>日期: ${startDate} - ${endDate}</p>
            <p>時間: ${startTime} - ${endTime}</p>
            <p>名額: ${scheduleItem.quota}</p>
            <p>課程狀態: ${courseValid}</p>
          </div>
        `,
      icon: 'info',
      confirmButtonColor: '#2b4f61',
      customClass: {
        confirmButton: 'custom-ok',
      },
      didOpen: () => {
        const popup = document.querySelector('.custom-ok')
        if (popup) {
          popup.style.fontSize = '1.4rem'
          popup.style.padding = '7px 18px'
        }
      },
    })
  }
  const handleAddSchedule = () => {
    if (!selectedDate) {
      Swal.fire({
        icon: 'warning',
        title: '請選擇日期',
        text: '',
        confirmButtonColor: '#2b4f61',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }
    const daySchedule = getDaySchedule(selectedDate)
    if (!daySchedule.length) {
      console.log('新增課程:', selectedDate)
      setSelectedDate(selectedDate)
      setShowCreateModal(true)
    } else {
      Swal.fire({
        icon: 'warning',
        title: '請選擇沒有排課的日期',
        text: '',
        confirmButtonColor: '#2b4f61',
        showConfirmButton: false,
        timer: 1000,
      })
    }
  }

  const handleEditSchedule = () => {
    if (!selectedDate) {
      Swal.fire({
        icon: 'warning',
        title: '請選擇日期',
        text: '',
        confirmButtonColor: '#2b4f61',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    const daySchedule = getDaySchedule(selectedDate)
    if (daySchedule.length) {
      console.log('編輯課程:', daySchedule[0])
      setShowEditModal(true)
      setEditSchedule(daySchedule[0])
    } else {
      Swal.fire({
        icon: 'warning',
        title: '所選日期沒有排程，請先新增課程',
        text: '',
        confirmButtonColor: '#2b4f61',
        showConfirmButton: false,
        timer: 1000,
      })
    }
  }
  const handleRemoveSchedule = async () => {
    if (!selectedDate) {
      Swal.fire({
        icon: 'warning',
        title: '請選擇日期',
        text: '',
        confirmButtonColor: '#2b4f61',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    const daySchedule = getDaySchedule(selectedDate)
    console.log('Day Schedule:', daySchedule)

    if (daySchedule.length) {
      const confirmed = await Swal.fire({
        icon: 'warning',
        title: '確定要刪除？',
        text: '',
        confirmButtonText: '確定',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonColor: '#2b4f61',
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

      if (confirmed.isConfirmed) {
        try {
          console.log('Deleting schedule with ID:', daySchedule[0].id)
          await deleteSchedule(daySchedule[0].id)
          Swal.fire({
            icon: 'success',
            title: '排程已刪除',
            showConfirmButton: false,
            timer: 1000,
          })
        } catch (err) {
          console.error('Delete error:', err)
          Swal.fire({
            icon: 'error',
            title: '刪除失敗',
            text: err.response?.data?.message || '發生未知錯誤，請洽後台人員',
            showConfirmButton: true,
            confirmButtonColor: '#2b4f61',
          })
        }
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: '無排程可以刪除',
        text: '',
        confirmButtonColor: '#2b4f61',
        showConfirmButton: false,
        timer: 1000,
      })
    }
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

      // 將日期設置為當地時間的開始部分，避免跨時區導致的日期錯誤
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
          onClick={() => setSelectedDate(date)}
          aria-label={`${i} ${currentDate.toLocaleString('default', {
            month: 'long',
          })} ${currentDate.getFullYear()}`}
          aria-pressed={isSelected}
        >
          <div>{i}</div>
          {daySchedule.map((scheduleItem, index) => (
            <div key={index} className={styles.scheduleItem}>
              課程: {scheduleItem.course_name} ({scheduleItem.course_area})
              <br />
              {scheduleItem.start_time} - {scheduleItem.end_time}
              <br />
              狀態：{scheduleItem.valid === 1 ? '已上架' : '已下架'}
              <FaEye
                style={{
                  cursor: 'pointer',
                  fontSize: '1.6rem',
                  marginLeft: '2px',
                  display: 'flex',
                  alignSelf: 'end',
                  justifySelf: 'end',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleShowDetails(scheduleItem)
                }}
              />
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

  const changeMonth = (increment) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    )
  }

  return (
    <>
      <div className={`container ${styles.calenAll}`}>
        <div className={styles.calenControll}>
          <Stack spacing={2} direction="row">
            <Button
              variant="outlined"
              sx={{
                width: '100px',
                fontSize: '1.2rem',
                color: '#2b4f61',
                background: '#ffffff',
                borderColor: '#ffffff',
                '&:hover': {
                  color: '#ffffff',
                  background: '#2b4f61',
                  borderColor: '#2b4f61',
                },
              }}
              onClick={handleAddSchedule}
            >
              新增排程
              <FaPlus style={{ marginLeft: '4px' }} />
            </Button>

            <Button
              variant="outlined"
              sx={{
                width: '100px',
                fontSize: '1.2rem',
                color: '#2b4f61',
                background: '#ffffff',
                borderColor: '#ffffff',
                '&:hover': {
                  color: '#ffffff',
                  background: '#2b4f61',
                  borderColor: '#2b4f61',
                },
              }}
              onClick={handleEditSchedule}
            >
              編輯排程
              <FaPencilAlt style={{ marginLeft: '4px' }} />
            </Button>
            <Button
              variant="outlined"
              sx={{
                width: '100px',
                fontSize: '1.2rem',
                color: '#2b4f61',
                background: '#ffffff',
                borderColor: '#ffffff',
                '&:hover': {
                  color: '#ffffff',
                  background: '#2b4f61',
                  borderColor: '#2b4f61',
                },
              }}
              onClick={handleRemoveSchedule}
            >
              刪除排程
              <FaTrashAlt style={{ marginLeft: '4px' }} />
            </Button>
          </Stack>
        </div>
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
          <div className={styles.calendarWeekdays}>
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>
          <div className={styles.calendarBody}>{renderCalendar()}</div>
        </div>
      </div>
      <CreateSchedule
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        courses={courses}
        locations={location}
        selectedDate={selectedDate}
        fetchBackSchedules={fetchBackSchedules}
      />
      <EditSchedule
        show={showEditModal && editSchedule !== null}
        onHide={() => {
          setShowEditModal(false)
          setEditSchedule(null)
        }}
        courses={courses}
        locations={location}
        scheduleData={editSchedule}
        scheduleId={editSchedule?.id}
        fetchBackSchedules={fetchBackSchedules}
      />
    </>
  )
}
