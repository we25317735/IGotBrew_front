import { useState } from 'react'
import styles from './assets/style/style.module.scss'
import Image from 'next/image'
import map from './assets/img/map.png'
import mapbutton from './assets/img/mapButton.jpg'
import { FaAngleRight } from 'react-icons/fa'
import Link from 'next/link'

export default function Section6() {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [userLocation, setUserLocation] = useState(null)

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 1))
  }

  const getLocation = (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setUserLocation([lat, lng])
          console.log('當前座標:', lat, lng)
          if (callback) callback([lat, lng])
        },
        (error) => {
          console.error('定位失敗:', error)
        }
      )
    } else {
      console.error('瀏覽器不支援地理定位')
    }
  }

  const navigateToGoogleMaps = () => {
    const purpose = [25.03376278655668, 121.56425823818044]

    if (userLocation) {
      const start = userLocation
      const navigationUrl = `https://www.google.com/maps/dir/${start[0]},${start[1]}/${purpose[0]},${purpose[1]}`
      window.location.href = navigationUrl
    } else {
      getLocation((location) => {
        const start = location
        const navigationUrl = `https://www.google.com/maps/dir/${start[0]},${start[1]}/${purpose[0]},${purpose[1]}`
        window.location.href = navigationUrl
      })
    }
  }

  return (
    <>
      <div className={`${styles['map-top']} container-fluid`}>
        <h2>I GOT BREW 據點</h2>
      </div>
      <div className={`${styles['section6']} `}>
        <div className={`${styles['map-main']} container`}>
          <div className={`${styles['map-bottom']} row`}>
            <div
              className={`${styles['map-bottom-top']} col-md-10 col-11 position-relative`}
            >
              <button
                className={`${styles['map-bottom-route']} position-absolute btn`}
                onClick={navigateToGoogleMaps}
              >
                <div className={`${styles['btn-more']}`}>
                  路線導覽
                  <FaAngleRight className={`${styles['icon']}`} />
                </div>
              </button>
              <div className={`${styles['map-bottom-zoom']} position-absolute`}>
                <div
                  className={`${styles['zoom-buttons']}`}
                  role="group"
                  aria-label="Vertical button group"
                >
                  <button
                    type="button"
                    className={`${styles['zoom-in']} ${styles['btn']} btn`}
                    onClick={handleZoomIn}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className={`${styles['zoom-out']} ${styles['btn']}btn`}
                    onClick={handleZoomOut}
                  >
                    -
                  </button>
                </div>
              </div>
              <div
                className={`${styles['map-transform']}`}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.3s ease',
                  overflow: 'hidden',
                }}
              >
                <Image src={map} alt="地圖" width={700} height={500} />
              </div>
            </div>
            <div
              className={`${styles['map-bottom-min']} col-lg-7 col-10 text-nowrap`}
            >
              <ul className={`list-unstyled`}>
                <li>
                  <span className={`${styles['detail-title']}`}>地點:</span>{' '}
                  <span>110 台北市信義區市府路45號</span>
                </li>
                <li>
                  <span className={`${styles['detail-title']}`}>交通:</span>{' '}
                  <span>搭乘淡水信義線至台北101站</span>
                </li>
                <li>
                  <span className={`${styles['detail-title']}`}>電話:</span>{' '}
                  <span>02-3456789</span>
                </li>
                <li>
                  <span className={`${styles['detail-title']}`}>電子郵件:</span>
                  <span>igotbrew@gmail.com</span>
                </li>
                <li>
                  <span className={`${styles['detail-title']}`}>營業時間:</span>{' '}
                  <span>11:00~19:00</span>
                </li>
                <li>
                  <span className={`${styles['detail-title']}`}>座位數量:</span>{' '}
                  <span>24個</span>
                </li>
              </ul>
            </div>
            <div className={`${styles['map-bottom-bottom']}`}>
              <Link href={`/cafeMap`} className="d-flex justify-content-center">
                <Image
                  className={`${styles['bottom-btn']}`}
                  src={mapbutton}
                  alt=""
                ></Image>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
