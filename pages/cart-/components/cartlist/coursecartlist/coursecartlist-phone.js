import React from 'react'
import styles from '@/styles/cartCourseListPhone.module.scss'
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
      <div className={`ms-3 ${styles['main-left-area']}`}>
        <div
          className={`py-2 ps-4 ${styles['main-left-title']} ${styles['h2']}`}
        >
          課程
        </div>
        <div className={`${styles['main-left-body']}`}>
          {cartItems1.map((course) => {
            return (
              <ul key={course.id} className={`list-unstyled d-flex pt-3`}>
                <div className="d-flex gap-4 col-11">
                  <div className={`ms-3 col-1 ${styles['products-img']}`}>
                    <Image
                      src={`http://localhost:3005/api/images/course/${course.img}`}
                      width={500}
                      height={500}
                      alt=""
                      className="w-100 h-100"
                    ></Image>
                  </div>
                  <div className="ms-2 col-7 d-flex flex-column justify-content-between">
                    <Link
                      className={`text-decoration-none ${styles['h5']} ${styles['title']}`}
                      href={`http://localhost:3000/course/${course.id}`}
                    >
                      {course.name}
                    </Link>
                    <div className={`mt-2 ${styles.location}`}>
                      時間:{course.schedule}
                    </div>
                    <div className={` ${styles.location}`}>
                      地點:{course.location}
                    </div>

                    <div className="d-flex justify-content-between">
                      <div className={`mt-2 ${styles.h6}`}>${course.price}</div>
                      <div
                        className={`d-flex mt-2 ${styles['counter-container']}`}
                      >
                        <button
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
                          className={`btn ${styles['counter-btn']}`}
                        >
                          <FaMinus />
                        </button>
                        <div
                          className={`${styles['counter-value']}`}
                          id="counter"
                        >
                          {course.qty}
                        </div>
                        <button
                          onClick={() => {
                            handleIncrease1(
                              course.id,
                              course.schedule,
                              course.location
                            )
                          }}
                          className={`btn ${styles['counter-btn']}`}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto my-auto ">
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
              </ul>
            )
          })}
        </div>
      </div>
    </>
  )
}
