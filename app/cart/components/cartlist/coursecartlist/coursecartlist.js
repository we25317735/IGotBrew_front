import React from 'react'
import styles from '@/styles/cartCourseList.module.scss'
import Image from 'next/image'
import { useCart } from '@/hooks/use-cart'
import { FaMinus, FaPlus } from 'react-icons/fa'
import Swal from 'sweetalert2'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import withReactContent from 'sweetalert2-react-content'
import Link from 'next/link'
export default function ProductCartList() {
  const {
    cartItems1 = [],
    handleDecrease1 = () => {},
    handleIncrease1 = () => {},
    handleRemove1 = () => {},
  } = useCart()
  const MySwal = withReactContent(Swal)
  const notifyAndRemove = (courseId, schedule, location) => {
    MySwal.fire({
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
          confirmBtn.style.fontSize = '16px'
          confirmBtn.style.padding = '7px 18px'
        }

        if (cancelBtn) {
          cancelBtn.style.fontSize = '16px'
          cancelBtn.style.padding = '7px 18px'
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: '刪除成功!',
          showConfirmButton: false,
          timer: 1000,
        })

        handleRemove1(courseId, schedule, location)
      }
    })
  }

  return (
    <>
      <div>
        <div className={`py-2 d-md-block d-none ${styles['main-left-title']}`}>
          <ul className={`d-md-flex d-none list-unstyled`}>
            <li className={`me-auto ms-5`}>課程</li>
            <li className={`col-md-2 d-flex justify-content-center`}>數量</li>
            <li className={`col-md-2 d-flex justify-content-center`}>單價</li>
            <li className={`col-md-2 d-flex justify-content-center`}>總計</li>
          </ul>
        </div>
        <div className={`${styles['main-left-body']}`}>
          {cartItems1.map((course) => {
            return (
              <ul className={`list-unstyled d-flex pt-4`} key={course.id}>
                <li className={`me-auto ${styles['summary2']}`}>
                  <div className="d-flex gap-4">
                    <div className={`ms-3 col-2 ${styles['products-img']}`}>
                      <Image
                        alt=""
                        src={`http://localhost:3005/api/images/course/${course.img}`}
                        width={100}
                        height={100}
                        className="w-100 h-100"
                      ></Image>
                    </div>
                    <div className="col-8 d-flex flex-column justify-content-evenly ">
                      <Link
                        className={`text-decoration-none ms-3 ${styles['h6']} ${styles['title']}`}
                        title={course.name}
                        href={`http://localhost:3000/course/${course.id}`}
                      >
                        {course.name}
                      </Link>

                      <div
                        id="div1"
                        className={`ms-3 mt-2 ${styles['p']} $ ${styles['course-color']} `}
                      >
                        時間: {course.schedule}
                        <br />
                        地點: {course.location}
                      </div>
                      <div>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            notifyAndRemove(
                              course.id,
                              course.schedule,
                              course.location
                            )
                          }}
                        >
                          <DeleteIcon
                            sx={{
                              fontSize: '2.4rem',
                            }}
                          />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </li>
                <li
                  className={`col-2 d-flex align-items-center justify-content-center ${styles['summary3']}`}
                >
                  <div className={`d-flex ${styles['counter-container']}`}>
                    <button
                      className={`btn ${styles['counter-btn']}`}
                      onClick={() => {
                        const nextQty = course.qty - 1
                        if (nextQty <= 0) {
                          notifyAndRemove(
                            course.id,
                            course.schedule,
                            course.location
                          )
                        } else {
                          handleDecrease1(
                            course.id,
                            course.schedule,
                            course.location
                          )
                        }
                      }}
                    >
                      <FaMinus />
                    </button>
                    <div className={`${styles['counter-value']}`} id="counter">
                      {course.qty}
                    </div>
                    <button
                      className={`btn ${styles['counter-btn']}`}
                      onClick={() => {
                        handleIncrease1(
                          course.id,
                          course.schedule,
                          course.location
                        )
                      }}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </li>
                <li
                  className={`col-2 d-flex align-items-center justify-content-center ${styles['summary4']}`}
                >
                  ${course.price}
                </li>
                <li
                  className={`col-2 d-flex align-items-center justify-content-center ${styles['summary5']}`}
                >
                  ${course.price * course.qty}
                </li>
              </ul>
            )
          })}
        </div>
      </div>
    </>
  )
}
