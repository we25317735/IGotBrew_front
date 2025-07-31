import Map2 from '@/components/map/googleMap'
import Header from '@/components/Header'
import { IoSearch } from 'react-icons/io5'
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2'
import { Modal, Button, Form } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import api from '@/pages/cafeMap/cafeApi'
import styles from '@/styles/cafeMap.module.scss'
import Link from 'next/link'
import Loading from '@/components/Loading'

export default function CafeMap() {
  const [isLoading, setIsLoading] = useState(true)
  const [cafes, setCafes] = useState([])
  const [filteredCafes, setFilteredCafes] = useState([])
  const [show, setShow] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filters, setFilters] = useState({
    wifi: '不限',
    seat: '不限',
    quiet: '不限',
    tasty: '不限',
    cheap: '不限',
    city: '不限',
  })

  const cityMapping = {
    taipei: '台北',
    keelung: '基隆',
    taoyuan: '桃園',
    hsinchu: '新竹',
    miaoli: '苗栗',
    taichung: '台中',
    nantou: '南投',
    changhua: '彰化',
    yunlin: '雲林',
    chiayi: '嘉義',
    tainan: '台南',
    kaohsiung: '高雄',
    pingtung: '屏東',
    yilan: '宜蘭',
    hualien: '花蓮',
    taitung: '台東',
    penghu: '澎湖',
    lienchiang: '連江',
  }

  const cities = Object.keys(cityMapping)

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setIsLoading(true)
        const data = await api.getCafesData()
        setCafes(data)
        setFilteredCafes(data)
      } catch (error) {
        console.error('Error fetching cafes data:', error)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1500)
      }
    }

    fetchCafes()
  }, [])

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const updatedFilters = {
      ...filters,
      [name]: value,
    }
    setFilters(updatedFilters)
    applyFilters(updatedFilters, searchKeyword)
  }

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value)
    applyFilters(filters, e.target.value)
  }

  const applyFilters = (filters, keyword) => {
    let filtered = cafes

    if (filters.city !== '不限') {
      filtered = filtered.filter(
        (cafe) => cafe.city.toLowerCase() === filters.city
      )
    }

    if (filters.wifi !== '不限') {
      filtered = filtered.filter((cafe) => cafe.wifi >= parseInt(filters.wifi))
    }
    if (filters.seat !== '不限') {
      filtered = filtered.filter((cafe) => cafe.seat >= parseInt(filters.seat))
    }
    if (filters.quiet !== '不限') {
      filtered = filtered.filter(
        (cafe) => cafe.quiet >= parseInt(filters.quiet)
      )
    }
    if (filters.tasty !== '不限') {
      filtered = filtered.filter(
        (cafe) => cafe.tasty >= parseInt(filters.tasty)
      )
    }
    if (filters.cheap !== '不限') {
      filtered = filtered.filter(
        (cafe) => cafe.cheap >= parseInt(filters.cheap)
      )
    }

    if (keyword) {
      filtered = filtered.filter((cafe) =>
        cafe.name.toLowerCase().includes(keyword.toLowerCase())
      )
    }

    setFilteredCafes(filtered)
  }

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  const CafeCard = ({ cafe }) => {
    return (
      <div className={`${styles['card']} card`}>
        <div className={`${styles['card-body']} card-body`}>
          <h5 className={`${styles['card-title']} card-title`}>{cafe.name}</h5>
          <p className={`${styles['card-text']} card-text`}>{cafe.address}</p>
          <Link
            href={cafe.url}
            className={`${styles['card-btn']} btn`}
            target="_blank"
            rel="noopener noreferrer"
          >
            查看更多
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className={`${styles['bg']} container-fluid mt-5`}>
        <div className={`container-fluid mt-5`}>
          <div className="row">
            <div
              className="col-4"
              style={{ height: '100vh', overflowY: 'auto' }}
            >
              <div className={`${styles['map-input']} input-group mb-3`}>
                <input
                  type="text"
                  className={`${styles['search-control']} form-control`}
                  placeholder="搜尋咖啡廳"
                  aria-label="搜尋咖啡廳"
                  aria-describedby="button-addon2"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                />
                <button
                  className={`${styles['btn-search']} btn btn-outline-secondary me-3`}
                  type="button"
                  id="button-addon2"
                >
                  <IoSearch />
                </button>
                <Button
                  className={`${styles['btn-filter']} btn`}
                  onClick={handleShow}
                >
                  篩選 <HiOutlineAdjustmentsHorizontal />
                </Button>

                <Modal
                  className={`${styles['filter-modal']}`}
                  show={show}
                  onHide={handleClose}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title className={`${styles['filter-title']}`}>
                      自訂篩選條件
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label className={`${styles['filter-subtitle']}`}>
                          城市
                        </Form.Label>
                        <Form.Select
                          name="city"
                          value={filters.city}
                          onChange={handleFilterChange}
                          className={`${styles['filter-select']}`}
                        >
                          <option>不限</option>
                          {cities.map((city) => (
                            <option key={city} value={city.toLowerCase()}>
                              {cityMapping[city]}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className={`${styles['filter-subtitle']}`}>
                          wifi
                        </Form.Label>
                        <Form.Select
                          name="wifi"
                          value={filters.wifi}
                          onChange={handleFilterChange}
                          className={`${styles['filter-select']}`}
                        >
                          <option>不限</option>
                          <option value="3">3 ⭐以上</option>
                          <option value="4">4 ⭐以上</option>
                          <option value="5">滿 5 ⭐</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className={`${styles['filter-subtitle']}`}>
                          座位數
                        </Form.Label>
                        <Form.Select
                          name="seat"
                          value={filters.seat}
                          onChange={handleFilterChange}
                          className={`${styles['filter-select']}`}
                        >
                          <option>不限</option>
                          <option value="3">3 ⭐以上</option>
                          <option value="4">4 ⭐以上</option>
                          <option value="5">滿 5 ⭐</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className={`${styles['filter-subtitle']}`}>
                          安靜程度
                        </Form.Label>
                        <Form.Select
                          name="quiet"
                          value={filters.quiet}
                          onChange={handleFilterChange}
                          className={`${styles['filter-select']}`}
                        >
                          <option>不限</option>
                          <option value="3">3 ⭐以上</option>
                          <option value="4">4 ⭐以上</option>
                          <option value="5">滿 5 ⭐</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className={`${styles['filter-subtitle']}`}>
                          咖啡好喝
                        </Form.Label>
                        <Form.Select
                          name="tasty"
                          value={filters.tasty}
                          onChange={handleFilterChange}
                          className={`${styles['filter-select']}`}
                        >
                          <option>不限</option>
                          <option value="3">3 ⭐以上</option>
                          <option value="4">4 ⭐以上</option>
                          <option value="5">滿 5 ⭐</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className={`${styles['filter-subtitle']}`}>
                          價格便宜
                        </Form.Label>
                        <Form.Select
                          name="cheap"
                          value={filters.cheap}
                          onChange={handleFilterChange}
                          className={`${styles['filter-select']}`}
                        >
                          <option>不限</option>
                          <option value="3">3 ⭐以上</option>
                          <option value="4">4 ⭐以上</option>
                          <option value="5">滿 5 ⭐</option>
                        </Form.Select>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      className={`${styles['btn-cancel']}`}
                      onClick={handleClose}
                    >
                      取消
                    </Button>
                    <Button
                      className={`${styles['btn-send']}`}
                      onClick={handleClose}
                    >
                      進行篩選
                    </Button>
                  </Modal.Footer>
                </Modal>
                <div className="row mt-4 g-3">
                  {filteredCafes.map((cafe) => (
                    <div className="col-md-6" key={cafe.id}>
                      <CafeCard cafe={cafe} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-8">
              <Map2 cafes={filteredCafes} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
