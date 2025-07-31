import axios from 'axios'
import { useEffect, useState } from 'react'

export default function useCourseApi() {
  // const courseURL = 'http://localhost:3005/api/course'
  const courseURL = 'https://igotbrew-render-back.onrender.com/api/course'
  const [courses, setCourses] = useState([])
  const [courseDetail, setCourseDetail] = useState(null)
  const [schedule, setSchedule] = useState([])
  const [location, setLocation] = useState([])
  const [coursetags, setCoursetags] = useState([])
  const [teachers, setTeachers] = useState([])
  const [reviews, setReviews] = useState([])

  const searchApi = `${courseURL}/search`
  const createCourseApi = `${courseURL}/createCourse`
  const updateCourseApi = `${courseURL}/updateCourse`
  const deleteCourseApi = `${courseURL}/deleteCourse`
  const scheduleApi = `${courseURL}/schedule`
  const locationApi = `${courseURL}/locations`
  const coursetagsApi = `${courseURL}/coursetags`
  const teachersApi = `${courseURL}/teachers`
  const createScheduleApi = `${courseURL}/createSchedule`
  const updateScheduleApi = `${courseURL}/updateSchedule`
  const deleteScheduleApi = `${courseURL}/deleteSchedule`

  //搜尋
  const fetchCourses = async (query = '') => {
    try {
      const res = await axios.get(searchApi, {
        params: { keywords: query },
      })
      setCourses(res.data.data.course)
      return res.data.data.course
    } catch (err) {
      console.error(err)
      setCourses([])
      return []
    }
  }
  //後台行事曆
  const fetchBackSchedules = async () => {
    try {
      const res = await axios.get(`${courseURL}/schedules`)
      setSchedule(res.data)
    } catch (error) {
      console.error('獲取課程數據失敗:', error)
    }
  }

  //篩選
  const fetchCoursesByTag = async (tagId = 'all') => {
    try {
      const res = await axios.get(courseURL, {
        params: { tagId },
      })
      setCourses(res.data)
      return res.data
    } catch (err) {
      console.error(err)
      setCourses([])
      return []
    }
  }
  //收藏
  const fetchUserFavorites = async (userId) => {
    try {
      const response = await axios.get(`${courseURL}/favorites/${userId}`)
      return response.data.favorites
    } catch (error) {
      console.error('獲取用戶收藏失敗:', error)
      return []
    }
  }
  //評論
  const fetchCourseReviews = async (courseId) => {
    try {
      const response = await axios.get(`${courseURL}/reviews/${courseId}`)
      console.log('Fetched reviews:', response.data.reviews)
      return response.data.reviews || []
    } catch (error) {
      console.error('獲取評論失敗:', error)
      return []
    }
  }
  const fetchSchedules = async () => {
    try {
      const res = await axios.get(scheduleApi)
      setSchedule(res.data)
    } catch (error) {
      console.error('獲取課程數據失敗:', error)
    }
  }
  useEffect(() => {
    fetchCourses()
    fetchBackSchedules()
    //課程表
    axios
      .get(courseURL)
      .then((res) => {
        setCourses(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
    //排程表
    axios
      .get(scheduleApi)
      .then((res) => {
        setSchedule(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
    //地點表
    axios
      .get(locationApi)
      .then((res) => {
        // console.log('Location data:', res.data);
        setLocation(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
    //類別表
    axios
      .get(coursetagsApi)
      .then((res) => {
        setCoursetags(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
    //老師表
    axios
      .get(teachersApi)
      .then((res) => {
        setTeachers(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  //新增排程
  const createSchedule = async (scheduleData) => {
    try {
      const res = await axios.post(createScheduleApi, scheduleData)
      setSchedule((prev) => [...prev, res.data])
      return res.data
    } catch (err) {
      console.log('創建排程失敗：', err)
      throw err
    }
  }

  //新增課程
  const createCourse = async (courseData) => {
    try {
      const res = await axios.post(createCourseApi, courseData)
      setCourses((prev) => [...prev, res.data])
      return res.data
    } catch (err) {
      console.log('創建課程失敗：', err)
      throw err
    }
  }
  //編輯課程圖片：
  const deleteCourseImage = async (courseId, imageField) => {
    try {
      const response = await axios.put(
        `${courseURL}/deleteCourseImage/${courseId}`,
        { imageField }
      )
      return response.data
    } catch (error) {
      console.error('刪除圖片失敗:', error)
      throw error
    }
  }

  //編輯課程
  const editCourse = async (courseId, courseData) => {
    try {
      const res = await axios.put(`${updateCourseApi}/${courseId}`, courseData)

      setCourses((prev) =>
        prev.map((item) =>
          item.id === courseId ? { ...item, ...courseData } : item
        )
      )
      return res.data
    } catch (err) {
      console.log('編輯排程失敗：', err)
      if (err.response) {
        console.error('Response data:', err.response.data)
        console.error('Response status:', err.response.status)
        console.error('Response headers:', err.response.headers)
      } else {
        console.error('Error message:', err.message)
      }
      throw err
    }
  }

  //編輯排程
  const editSchedule = async (scheduleId, scheduleData) => {
    try {
      const res = await axios.put(
        `${updateScheduleApi}/${scheduleId}`,
        scheduleData
      )

      setSchedule((prev) =>
        prev.map((item) =>
          item.id === scheduleId ? { ...item, ...scheduleData } : item
        )
      )
      return res.data
    } catch (err) {
      console.log('編輯排程失敗：', err)
      throw err
    }
  }
  //刪除課程
  const deleteCourse = async (courseId) => {
    try {
      const res = await axios.delete(`${deleteCourseApi}/${courseId}`)

      setCourses((prev) => prev.filter((item) => item.id !== courseId))
      console.log('刪除課程:', res.data)
      return res.data
    } catch (err) {
      console.log('刪除課程失敗：', err)
      throw err
    }
  }

  //刪除排程
  const deleteSchedule = async (scheduleId) => {
    try {
      const res = await axios.delete(`${deleteScheduleApi}/${scheduleId}`)

      setSchedule((prev) => prev.filter((item) => item.id !== scheduleId))
      console.log('刪除排程:', res.data)
      return res.data
    } catch (err) {
      console.log('刪除排程失敗：', err)
      throw err
    }
  }
  return {
    reviews,
    setReviews,
    courses,
    setCourses,
    courseDetail,
    setCourseDetail,
    schedule,
    setSchedule,
    location,
    setLocation,
    coursetags,
    setCoursetags,
    teachers,
    setTeachers,
    createSchedule,
    createCourse,
    editSchedule,
    editCourse,
    deleteCourse,
    deleteSchedule,
    fetchCourses,
    fetchCoursesByTag,
    fetchUserFavorites,
    fetchCourseReviews,
    deleteCourseImage,
    fetchBackSchedules,
    fetchSchedules,
  }
}
