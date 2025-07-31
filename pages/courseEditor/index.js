import React, { useState, useEffect } from 'react'
import styles from '@/styles/courseEditor.module.scss'
import Image from 'next/image'
import Calender from './calender'
import Table from './table'
import Loading from '@/components/Loading'
import { FaTableList } from 'react-icons/fa6'
import { FaRegCalendarDays } from 'react-icons/fa6'
import Header from '@/components/Header'
import BackSelect from '@/components/backSelect'

export default function CourseEditor() {
  const [courseManage, setCourseManage] = useState(true)
  const handleChange = () => {
    setCourseManage(!courseManage)
  }
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
  return (
    <>
      <Header />
      <BackSelect />
      <div className={`container-fluid ${styles.courseFluidEdit}`}>
        <div className={styles.bgup}>
          <Image
            src={'http://localhost:3005/api/images/course/coffee up1.png'}
            alt=""
            width={2500}
            height={1400}
          />
        </div>
        <p className={`${styles.title}`}>課程管理</p>
        <div className={`${styles['filter']} container`}>
          <div className={`${styles['switch']}`}>
            <input
              className={`${styles['check-toggle']} ${styles['checkFilter']}`}
              id="toggle"
              type="checkbox"
              checked={courseManage}
              onChange={handleChange}
            />
            <label htmlFor="toggle" />
            <span className={`${styles['on']}`}>
              課程總覽 <FaTableList />
            </span>
            <span className={`${styles['off']}`}>
              排程總覽 <FaRegCalendarDays />
            </span>
          </div>
        </div>
        {courseManage ? <Calender /> : <Table />}
      </div>
    </>
  )
}
