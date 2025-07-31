import React, { useState, useEffect } from 'react'
import styles from '@/styles/courseEditorTable.module.scss'

import { FaPlus } from 'react-icons/fa6'
import { FaPencilAlt, FaTrashAlt, FaSearch, FaEye } from 'react-icons/fa'

import useCourseApi from '@/services/courseApi'
import PropTypes from 'prop-types'
import Image from 'next/image'

//mui
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Box,
  useTheme,
  Button,
  Stack,
  InputBase,
} from '@mui/material'
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@mui/icons-material'

import CreateCourse from './createCourse'
import EditCourse from './editCourse'

//sweetalert
import Swal from 'sweetalert2'

export default function CustomTable() {
  //匯入課程
  const { courses, deleteCourse, fetchCourses, teachers, coursetags } =
    useCourseApi()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedCourse, setSelectCourse] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editCourse, setEditCourse] = useState(null)

  // console.log('Rendered Courses:', courses)
  // 處理表格翻頁
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // 處理表格每頁顯示數量的改變
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    fetchCourses(searchQuery) // 每次 searchQuery 變化時都會觸發
  }, [searchQuery])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }
  const handleSearchClick = () => {
    fetchCourses(searchQuery)
  }

  const handleSelectCourse = (course) => {
    setSelectCourse(course)
  }
  const handleAddCourse = () => {
    setShowCreateModal(true)
  }
  const handleEditCourse = () => {
    if (!selectedCourse) {
      Swal.fire({
        icon: 'warning',
        title: '請選擇課程',
        text: '',
        confirmButtonColor: '#2b4f61',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }
    console.log('編輯課程：', selectedCourse?.id)
    setShowEditModal(true)
    setEditCourse(selectedCourse)
  }
  const handleRemoveCourse = async () => {
    if (!selectedCourse) {
      Swal.fire({
        icon: 'warning',
        title: '請選擇課程',
        text: '',
        confirmButtonColor: '#2b4f61',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    const confirmed = await Swal.fire({
      icon: 'warning',
      title: '確定要刪除？',
      text: '',
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
        console.log('Deleting course with ID:', selectedCourse.id)
        await deleteCourse(selectedCourse.id)
        Swal.fire({
          icon: 'success',
          title: '課程已刪除',
          showConfirmButton: false,
          timer: 1000,
        })
      } catch (err) {
        console.error('Delete error:', err)
        Swal.fire({
          icon: 'error',
          title: '刪除失敗',
          text: err.response?.data?.message || '發生未知錯誤，請洽專業人員',
          showConfirmButton: true,
          confirmButtonColor: '#2b4f61',
        })
      }
    }
  }
  const handleViewCourseDetails = (course) => {
    Swal.fire({
      title: `${course.name}`,
      html: `
  <div style="display: flex; flex-direction: column; align-items: flex-start; font-size: 1.4rem;gap:4px;overflow-x:hidden;">
    <p>類別: ${course.tag1_name}\n${course.tag2_name}</p>
    <p>老師: ${course.course_teacher}</p>
    <p>價格: ${course.price}</p>
    <div style="display: flex;flex-direction: column;align-items:start;">主圖片:<br /><img style="object-fit: cover;" src="http://localhost:3005/api/images/course/${
      course.img_main
    }" width="100" height="100" /></div>
   <div style="display: flex;flex-direction: column;align-items:start;">
   介紹圖片:
    <div style="display: ${
      course.img_1 || course.img_2 || course.img_3 ? 'flex' : 'none'
    }; gap: 2px; margin-bottom: 10px;">

      ${
        course.img_1
          ? `<img src="http://localhost:3005/api/images/course/${course.img_1}" width="90" height="90" />`
          : ''
      }
      ${
        course.img_2
          ? `<img src="http://localhost:3005/api/images/course/${course.img_2}" width="90" height="90" />`
          : ''
      }
      ${
        course.img_3
          ? `<img src="http://localhost:3005/api/images/course/${course.img_3}" width="90" height="90" />`
          : ''
      }
    </div>
   </div> 
   
    <p style="text-align:start;">內容:<br/> ${course.content}</p>
    <p>狀態: ${course.valid ? '上架' : '下架'}</p>
  </div>
`,
      icon: 'info',
      confirmButtonColor: '#2b4f61',
    })
  }

  // 計算空行
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - courses.length) : 0

  return (
    <div className={`container ${styles.calenAll}`}>
      <div className={styles.calenControll}>
        <Stack spacing={2} direction="row">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
              backgroundColor: '#fff',
            }}
            className={styles.search}
          >
            <InputBase
              placeholder="搜索課程"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                pl: 1,
                flex: 1,
                fontSize: '1.2rem',
                backgroundColor: '#fff',
                minWidth: '160px',
                height: '100%',
                borderRadius: '4px 0 0 4px',
              }}
            />
            <IconButton
              onClick={handleSearchClick}
              type="submit"
              sx={{
                p: '10px',
                backgroundColor: '#2b4f61',
                borderRadius: '0 4px 4px 0',
                '&:hover': { backgroundColor: '#1a2c3f' },
              }}
            >
              <FaSearch style={{ color: '#fff' }} />
            </IconButton>
          </div>
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
            onClick={handleAddCourse}
          >
            新增課程
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
            onClick={handleEditCourse}
          >
            編輯課程
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
            onClick={handleRemoveCourse}
          >
            刪除課程
            <FaTrashAlt style={{ marginLeft: '4px' }} />
          </Button>
        </Stack>
      </div>
      <div className={styles.table}>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 500, zIndex: 5 }}
            aria-label="custom pagination table"
          >
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: '#2b4f61',
                  color: '#fff',
                  border: '2px solid #2b4f61',
                }}
              >
                <TableCell
                  sx={{ fontSize: '1.2rem', width: '100px', color: '#fff' }}
                >
                  課程編號
                </TableCell>
                <TableCell
                  sx={{ fontSize: '1.2rem', width: '180px', color: '#fff' }}
                >
                  名稱
                </TableCell>
                <TableCell
                  sx={{ fontSize: '1.2rem', width: '100px', color: '#fff' }}
                >
                  圖示
                </TableCell>
                <TableCell sx={{ fontSize: '1.2rem', color: '#fff' }}>
                  類別
                </TableCell>
                <TableCell sx={{ fontSize: '1.2rem', color: '#fff' }}>
                  老師
                </TableCell>
                <TableCell sx={{ fontSize: '1.2rem', color: '#fff' }}>
                  價錢
                </TableCell>
                <TableCell sx={{ fontSize: '1.2rem', color: '#fff' }}>
                  狀態
                </TableCell>
                <TableCell sx={{ fontSize: '1.2rem', color: '#fff' }}>
                  查看詳情
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length > 0 ? (
                (rowsPerPage > 0
                  ? courses.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : courses
                ).map((course) => (
                  <TableRow
                    key={course.id}
                    onClick={() => handleSelectCourse(course)}
                    selected={selectedCourse?.id == course.id}
                    sx={{
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      border:
                        selectedCourse?.id == course.id
                          ? '2px solid #eba92a'
                          : '',
                      backgroundColor:
                        selectedCourse?.id == course.id ? '#5e7d8e' : '',
                      '&:hover': {
                        backgroundColor: '#b3c0c6',
                        color: '#1b3947',
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontSize: '1.2rem',
                        width: '100px',
                        backgroundColor:
                          selectedCourse?.id == course.id ? '#B3C0C6' : '',
                      }}
                    >
                      {course.number}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontSize: '1.2rem',
                        width: '180px',
                        backgroundColor:
                          selectedCourse?.id == course.id ? '#B3C0C6' : '',
                      }}
                    >
                      {course.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        backgroundColor:
                          selectedCourse?.id == course.id ? '#B3C0C6' : '',
                      }}
                    >
                      <Image
                        src={`http://localhost:3005/api/images/course/${course.img_main}`}
                        alt=""
                        width={100}
                        height={100}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        width: '90px',
                        fontSize: '1.2rem',
                        backgroundColor:
                          selectedCourse?.id == course.id ? '#B3C0C6' : '',
                      }}
                    >
                      <div
                        style={{
                          padding: '2px',
                          backgroundColor: '#2b4f61',
                          color: '#ffffff',
                          marginBottom: '2px',
                          borderRadius: '2px',
                        }}
                      >
                        {course.tag1_name}
                      </div>
                      <div
                        style={{
                          padding: '2px',
                          backgroundColor: '#2b4f61',
                          color: '#ffffff',
                          borderRadius: '2px',
                        }}
                      >
                        {course.tag2_name}
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '1.2rem',
                        backgroundColor:
                          selectedCourse?.id == course.id ? '#B3C0C6' : '',
                      }}
                    >
                      {course.course_teacher}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '1.2rem',
                        backgroundColor:
                          selectedCourse?.id == course.id ? '#B3C0C6' : '',
                      }}
                    >
                      {course.price}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '1.2rem',
                        backgroundColor:
                          selectedCourse?.id == course.id ? '#B3C0C6' : '',
                      }}
                    >
                      {course.valid === 1 ? '已上架' : '已下架'}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '1.2rem',
                        backgroundColor:
                          selectedCourse?.id == course.id ? '#B3C0C6' : '',
                      }}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewCourseDetails(course)
                        }}
                      >
                        <FaEye style={{ color: '#2b4f61' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ fontSize: '1.2rem' }}
                  >
                    沒有課程
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={courses.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
                <CreateCourse
                  show={showCreateModal}
                  onHide={() => {
                    setShowCreateModal(false)
                    fetchCourses()
                  }}
                  fetchCourses={fetchCourses}
                />
                <EditCourse
                  show={showEditModal && editCourse !== null}
                  onHide={() => {
                    setShowEditModal(false)
                    setEditCourse(null)
                    fetchCourses()
                  }}
                  teachers={teachers}
                  coursetags={coursetags}
                  courseData={editCourse}
                  courseId={editCourse?.id}
                  fetchCourses={fetchCourses}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

function TablePaginationActions(props) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
}
