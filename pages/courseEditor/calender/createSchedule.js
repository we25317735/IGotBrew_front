import React, { useState, useEffect } from 'react'
import useCourseApi from '../../../services/courseApi'
import { Modal, Button, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

export default function CreateSchedule(props) {
  const { createSchedule, courses, location, fetchBackSchedules } =
    useCourseApi()
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [quota, setQuota] = useState('')
  const [valid, setValid] = useState(1)

  const [errors, setErrors] = useState({})
  const router = useRouter()

  const toggleValid = () => {
    setValid((prevValid) => (prevValid === 1 ? 0 : 1))
  }

  useEffect(() => {
    if (props.show && props.selectedDate) {
      const adjustedDate = new Date(props.selectedDate.getTime())
      adjustedDate.setHours(0, 0, 0, 0)

      const formattedDate = adjustedDate.toLocaleDateString('en-CA')
      setStartDate(formattedDate)
      setEndDate(formattedDate)
      const now = new Date()
      const selectedDate = new Date(props.selectedDate)
      setValid(selectedDate >= now ? 1 : 0)
      if (selectedDate > now) {
        setValid(1)
      } else if (
        selectedDate.getFullYear() === now.getFullYear() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getDate() === now.getDate()
      ) {
        setValid(0)
      } else {
        setValid(0)
      }
    }
  }, [props.show, props.selectedDate])

  const handleCreate = () => {
    const newErrors = {}

    // 驗證各個欄位
    if (!selectedCourseId) newErrors.selectedCourseId = '必選'
    if (!selectedLocationId) newErrors.selectedLocationId = '必選'
    if (!startDate) newErrors.startDate = '必填'
    if (!endDate) newErrors.endDate = '必填'
    if (!startTime) newErrors.startTime = '必填'
    if (!endTime) newErrors.endTime = '必填'
    if (!quota) newErrors.quota = '必填'

    // 如果有錯誤，則更新錯誤狀態並停止提交
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      Swal.fire({
        icon: 'error',
        title: '表單有誤',
        text: '請檢查所有必填項是否已完成',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    const scheduleData = {
      course_id: selectedCourseId,
      location_id: selectedLocationId,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      quota,
      valid: valid !== undefined ? valid : 0,
    }
    createSchedule(scheduleData)
      .then((res) => {
        console.log('Schedule created:', res)
        Swal.fire({
          icon: 'success',
          title: '排程新增成功',
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          props.fetchBackSchedules() // 呼叫父組件的資料刷新方法
          props.onHide() // 關閉表單
        })
      })
      .catch((err) => {
        console.error('Failed to create schedule:', err)
        Swal.fire({
          icon: 'error',
          title: '排程新增失敗',
          showConfirmButton: false,
          timer: 1000,
        })
      })
  }
  // 用於清除錯誤信息的函數
  const handleChange = (field, value) => {
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }))
    }
    if (field === 'selectedCourseId') setSelectedCourseId(value)
    if (field === 'selectedLocationId') setSelectedLocationId(value)
    if (field === 'startDate') setStartDate(value)
    if (field === 'endDate') setEndDate(value)
    if (field === 'startTime') setStartTime(value)
    if (field === 'endTime') setEndTime(value)
    if (field === 'quota') setQuota(value)
  }
  const handlePresetFill = () => {
    setSelectedCourseId(
      courses.find((course) => course.name === 'SCA INTRODUCTION TO COFFEE')
        ?.id || ''
    )
    setSelectedLocationId(
      location.find(
        (loc) => loc.location === '台北場  114台北市內湖區內湖路三段64號2樓'
      )?.id || ''
    )
    setQuota('10')
    setStartTime('10:00')
    setEndTime('16:00')
  }
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      size="lg"
      aria-labelledby="createScheduleModal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="createScheduleModal"
          style={{
            fontSize: '2rem',
            color: '#1b3947',
          }}
        >
          新增排程
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
              onChange={(e) => handleChange('selectedCourseId', e.target.value)}
              style={{
                fontSize: '1.6rem',
                borderColor: errors.selectedCourseId ? 'red' : '',
              }}
            >
              <option value="">選擇課程</option>
              {courses &&
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
            </Form.Control>
            {errors.selectedCourseId && (
              <Form.Text className="text-danger">
                {errors.selectedCourseId}
              </Form.Text>
            )}
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
                onChange={(e) =>
                  handleChange('selectedLocationId', e.target.value)
                }
                style={{
                  fontSize: '1.6rem',
                  borderColor: errors.selectedLocationId ? 'red' : '',
                }}
              >
                <option value="">選擇位置</option>
                {location &&
                  location.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.location}
                    </option>
                  ))}
              </Form.Control>
              {errors.selectedLocationId && (
                <Form.Text className="text-danger">
                  {errors.selectedLocationId}
                </Form.Text>
              )}
            </div>
            <div>
              <Form.Label>名額</Form.Label>
              <Form.Control
                type="number"
                value={quota}
                onChange={(e) => handleChange('quota', e.target.value)}
                style={{
                  fontSize: '1.6rem',
                  borderColor: errors.quota ? 'red' : '',
                }}
              ></Form.Control>
              {errors.quota && (
                <Form.Text className="text-danger">{errors.quota}</Form.Text>
              )}
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
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  style={{
                    fontSize: '1.6rem',
                    borderColor: errors.selectedCourseId ? 'red' : '',
                  }}
                ></Form.Control>
                {errors.startTime && (
                  <Form.Text className="text-danger">
                    {errors.startTime}
                  </Form.Text>
                )}
              </div>
              ～
              <div>
                結束
                <Form.Control
                  type="time"
                  value={endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  style={{
                    fontSize: '1.6rem',
                    borderColor: errors.selectedCourseId ? 'red' : '',
                  }}
                ></Form.Control>
                {errors.endTime && (
                  <Form.Text className="text-danger">
                    {errors.endTime}
                  </Form.Text>
                )}
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
          variant="primary"
          onClick={handlePresetFill}
          style={{
            fontSize: '1.2rem',
            backgroundColor: '#2b4f61',
            color: '#fff',
          }}
        >
          預設填入
        </Button>
        <Button
          variant=""
          onClick={handleCreate}
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
