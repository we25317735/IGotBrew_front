/* eslint-disable react/display-name */
import React, { useState, useEffect, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
import styles from '@/styles/anal.module.scss'
import { FaMugHot } from 'react-icons/fa'
import { FaUserGroup } from 'react-icons/fa6'
import { GiCoffeeBeans } from 'react-icons/gi'
import { SiBuymeacoffee } from 'react-icons/si'
import { GiHeartInside } from 'react-icons/gi'
import { GiHeartStake } from 'react-icons/gi'
import Header from '@/components/Header'
import Loading from '@/components/Loading'
import BackSelect from '@/components/backSelect'

const COLORS = ['#2b4f61', '#eba92a', '#5d8aa8', '#e6a756', '#7cb5d1']

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/api/anal')
        const result = await response.json()
        setData(result)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      }
    }

    fetchData()
  }, [])

  const modifiedData = useMemo(() => {
    return data?.productSales.map((item) => {
      switch (item.name) {
        case 'bean':
          return { ...item, name: '咖啡豆' }
        case 'machine':
          return { ...item, name: '咖啡機' }
        case 'other':
          return { ...item, name: '其他/配件' }
        default:
          return item
      }
    })
  }, [data?.productSales])

  const formatTaiwanTime = useMemo(() => {
    return (isoDate) => {
      const date = new Date(isoDate)
      return date.toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    }
  }, [])

  const truncateTitle = useMemo(() => {
    return (title) => (title.length > 8 ? `${title.slice(0, 8)}...` : title)
  }, [])

  if (loading || !data) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <div className={`${styles.backg} min-h-screen mt-5`}>
      <Header />
      <BackSelect />
      <p
        className="mb-3 text-center mt-5"
        style={{ fontSize: '3.5rem', fontWeight: 700, color: '#2b4f61' }}
      >
        用戶與銷售分析
      </p>
      <div className="d-flex">
        <ChartContainer title="會員性別" icon={FaUserGroup}>
          <PieChartComponent data={data.genderRatio} />
        </ChartContainer>
        <ChartContainer title="商品銷售種類" icon={FaMugHot}>
          <BarChartComponent data={modifiedData} />
        </ChartContainer>
        <ChartContainer title="下單日期趨勢" icon={SiBuymeacoffee}>
          <AreaChartComponent
            data={data.orderTrend}
            formatTaiwanTime={formatTaiwanTime}
          />
        </ChartContainer>
      </div>
      <div className="d-flex justify-between items-center h-[230px] w-full">
        <ChartContainer title="文章like次數" icon={GiHeartStake}>
          <BarChartVerticalComponent
            data={data.articleLikes}
            truncateTitle={truncateTitle}
          />
        </ChartContainer>
        <ChartContainer title="課程銷售tag" icon={GiCoffeeBeans}>
          <CourseSalesChartComponent data={data.courseSales} />
        </ChartContainer>
        <ChartContainer title="用戶註冊日期趨勢" icon={GiHeartInside}>
          <LineChartComponent
            data={data.userRegistration}
            formatTaiwanTime={formatTaiwanTime}
          />
        </ChartContainer>
      </div>
    </div>
  )
}

const ChartContainer = React.memo(({ title, icon: Icon, children }) => (
  <div className="rounded-lg chartb p-4 mx-auto">
    <h2 className="font-semibold text-lg mb-4 text-center">
      <Icon style={{ marginRight: '8px', color: '#4b3b39' }} />
      {title}
    </h2>
    {children}
  </div>
))

// eslint-disable-next-line react/display-name
const PieChartComponent = React.memo(({ data }) => (
  <div style={{ width: '100%', height: '200px' }}>
    <PieChart width={360} height={200}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="gender"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
))

// eslint-disable-next-line react/display-name
const BarChartComponent = React.memo(({ data }) => (
  <div style={{ width: '100%', height: '200px' }}>
    <BarChart width={360} height={200} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="sales" fill="#2b4f61" />
    </BarChart>
  </div>
))
const CourseSalesChartComponent = React.memo(({ data }) => (
  <div style={{ width: '100%', height: '200px' }}>
    <AreaChart width={360} height={200} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="sales" stroke="#eba92a" fill="#eba92a" />
    </AreaChart>
  </div>
))
// eslint-disable-next-line react/display-name
const AreaChartComponent = React.memo(({ data, formatTaiwanTime }) => (
  <div style={{ width: '100%', height: '200px' }}>
    <AreaChart width={360} height={200} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" tickFormatter={formatTaiwanTime} />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="count" stroke="#eba92a" fill="#eba92a" />
    </AreaChart>
  </div>
))

// eslint-disable-next-line react/display-name
const BarChartVerticalComponent = React.memo(({ data, truncateTitle }) => (
  <div style={{ width: '100%', height: '200px' }}>
    <BarChart width={360} height={200} data={data} layout="vertical">
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis
        dataKey="title"
        type="category"
        width={120}
        tickFormatter={truncateTitle}
      />
      <Tooltip />
      <Legend />
      <Bar dataKey="likes" fill="#2b4f61" />
    </BarChart>
  </div>
))

const LineChartComponent = React.memo(({ data, formatTaiwanTime }) => (
  <div style={{ width: '100%', height: '200px' }}>
    <LineChart width={360} height={200} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" tickFormatter={formatTaiwanTime} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="count" stroke="#2b4f61" />
    </LineChart>
  </div>
))

export default Dashboard
