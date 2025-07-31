import React, { useState, useEffect } from 'react'
import useCourseApi from '../../../services/courseApi'
import { Modal, Button, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import moment from 'moment'

export default function EditSchedule(props) {
  const {
    editSchedule,
    courses,
    location,
    deleteCourseImage,
    fetchBackSchedules,
  } = useCourseApi()
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [quota, setQuota] = useState('')
  const [valid, setValid] = useState(1)
  const router = useRouter()

  useEffect(() => {
    if (props.show && props.scheduleData) {
      const {
        course_id,
        location_id,
        start_date,
        end_date,
        start_time,
        end_time,
        quota,
        valid,
      } = props.scheduleData

      setSelectedCourseId(course_id || '')
      setSelectedLocationId(location_id || '')
      // 調整日期處理邏輯，確保格式一致
      const formattedStartDate = moment(start_date).format('YYYY-MM-DD')
      const formattedEndDate = moment(end_date).format('YYYY-MM-DD')
      setStartDate(formattedStartDate)
      setEndDate(formattedEndDate)
      setStartTime(start_time || '')
      setEndTime(end_time || '')
      setQuota(quota || '')
      setValid(valid !== undefined ? valid : 1)
    }
  }, [props.show, props.scheduleData])

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayFormatted = today.toLocaleDateString('en-CA')

    setValid(startDate < todayFormatted || endDate < todayFormatted ? 0 : 1)
  }, [startDate, endDate])

  const toggleValid = () => {
    setValid((prevValid) => (prevValid === 1 ? 0 : 1))
  }

  const handleEdit = () => {
    const scheduleData = {
      course_id: selectedCourseId,
      location_id: selectedLocationId,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      quota,
      valid,
    }

    editSchedule(props.scheduleId, scheduleData)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '排程已更新',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          props.fetchBackSchedules() // 呼叫父組件的資料刷新方法
          props.onHide() // 關閉表單
        })
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: '排程更新失敗',
          timer: 1500,
        })
      })
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      size="lg"
      aria-labelledby="editScheduleModal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="editScheduleModal"
          style={{
            fontSize: '2rem',
            color: '#1b3947',
          }}
        >
          編輯排程
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          style={{
            fontSize: '1.6rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            color: '#1b3947',
          }}
        >
          <Form.Group controlId="formCourseSelect">
            <Form.Label>課程</Form.Label>
            <Form.Control
              as="select"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              style={{ fontSize: '1.6rem' }}
            >
              <option value="">選擇課程</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group
            controlId="formMixSelect"
            className="mt-3"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'start',
              gap: '32px',
            }}
          >
            <div>
              <Form.Label>地點</Form.Label>
              <Form.Control
                as="select"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                style={{ fontSize: '1.6rem' }}
              >
                <option value="">選擇位置</option>
                {location.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.location}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div>
              <Form.Label>名額</Form.Label>
              <Form.Control
                type="number"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                style={{ fontSize: '1.6rem' }}
              ></Form.Control>
            </div>
          </Form.Group>

          <Form.Group
            controlId="formDateSelect"
            className="mt-3"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'start',
              gap: '8px',
            }}
          >
            <Form.Label>日期</Form.Label>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                gap: '8px',
              }}
            >
              <div>
                開始
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ fontSize: '1.6rem' }}
                ></Form.Control>
              </div>
              ~
              <div>
                結束
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ fontSize: '1.6rem' }}
                ></Form.Control>
              </div>
            </div>
          </Form.Group>

          <Form.Group
            controlId="formTimeSelect"
            className="mt-3"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'start',
              gap: '8px',
            }}
          >
            <Form.Label>時間</Form.Label>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                gap: '8px',
              }}
            >
              <div>
                開始
                <Form.Control
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{ fontSize: '1.6rem' }}
                ></Form.Control>
              </div>
              ～
              <div>
                結束
                <Form.Control
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={{ fontSize: '1.6rem' }}
                ></Form.Control>
              </div>
            </div>
          </Form.Group>
          <Form.Group controlId="formValidSelect" className="mt-3">
            <Form.Label>課程狀態</Form.Label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button
                variant="outline-primary"
                onClick={toggleValid}
                style={{
                  fontSize: '1.6rem',
                  color: valid === 1 ? '#5e7d8e' : 'red',
                  borderColor: valid === 1 ? '#1b3947' : 'red',
                  width: '100px',
                }}
              >
                {valid === 1 ? '上架' : '下架'}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer
        style={{
          fontSize: '1.2rem',
        }}
      >
        <Button
          variant=""
          onClick={handleEdit}
          style={{
            fontSize: '1.2rem',
            backgroundColor: '#2b4f61',
            color: '#fff',
          }}
        >
          確認
        </Button>
        <Button
          variant="secondary"
          onClick={props.onHide}
          style={{ fontSize: '1.2rem' }}
        >
          關閉
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
