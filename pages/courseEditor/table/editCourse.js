import React, { useState, useEffect, useRef } from 'react'
import useCourseApi from '../../../services/courseApi'
import { Modal, Button, Form } from 'react-bootstrap'
import { FaFileUpload, FaTimes } from 'react-icons/fa'
import Swal from 'sweetalert2'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function EditCourse(props) {
  const { editCourse, coursetags, teachers, deleteCourseImage, fetchCourses } =
    useCourseApi()
  const [name, setName] = useState('')
  const [selectTag1, setSelectTag1] = useState('')
  const [selectTag2, setSelectTag2] = useState('')
  const [imgMain, setImgMain] = useState(null)
  const [imgMainPreview, setImgMainPreview] = useState(null)
  const [imgMainFileName, setImgMainFileName] = useState('未選擇任何檔案')
  const [img1, setImg1] = useState(null)
  const [img2, setImg2] = useState(null)
  const [img3, setImg3] = useState(null)
  const [imgsPreviews, setImgsPreviews] = useState([])
  const [imgsFileNames, setImgsFileNames] = useState('未選擇任何檔案')
  const [selectTeacher, setSelectTeacher] = useState('')
  const [content, setContent] = useState('')
  const [price, setPrice] = useState('')
  const [valid, setValid] = useState(1)
  const [existingImgs, setExistingImgs] = useState([])
  const [imgsToDelete, setImgsToDelete] = useState([])
  const [errors, setErrors] = useState({})
  const router = useRouter()

  const imgMainInputRef = useRef(null)
  const imgsInputRef = useRef(null)

  useEffect(() => {
    if (props.show && props.courseData) {
      const {
        name,
        tag1,
        tag2,
        img_main,
        img_1,
        img_2,
        img_3,
        teacher_id,
        content,
        price,
        valid,
      } = props.courseData

      setName(name || '')
      setSelectTag1(tag1 || '')
      setSelectTag2(tag2 || '')
      setSelectTeacher(teacher_id || '')
      setContent(content || '')
      setPrice(price || '')
      setValid(valid !== undefined ? valid : 1)

      if (img_main) {
        setImgMainPreview(`http://localhost:3005/api/images/course/${img_main}`)
        setImgMainFileName(img_main)
      }

      const initialImages = []
      const initialFileNames = []

      if (img_1) {
        initialImages.push({
          src: `http://localhost:3005/api/images/course/${img_1}`,
          name: img_1,
        })
        initialFileNames.push(img_1)
      }
      if (img_2) {
        initialImages.push({
          src: `http://localhost:3005/api/images/course/${img_2}`,
          name: img_2,
        })
        initialFileNames.push(img_2)
      }
      if (img_3) {
        initialImages.push({
          src: `http://localhost:3005/api/images/course/${img_3}`,
          name: img_3,
        })
        initialFileNames.push(img_3)
      }
      setExistingImgs(initialImages)
      setImgsFileNames(initialFileNames.join(', '))
    }
  }, [props.show, props.courseData])

  const handleEdit = async () => {
    const courseData = {
      name,
      tag1: selectTag1,
      tag2: selectTag2,
      teacher_id: selectTeacher,
      content,
      price,
      valid,
      imgsToDelete,
    }

    const formData = new FormData()
    Object.keys(courseData).forEach((key) => {
      formData.append(key, courseData[key])
    })

    if (imgMain) {
      formData.append('img_main', imgMain)
      formData.append('has_new_img_main', 'true')
    }
    const newImages = [img1, img2, img3].filter((img) => img !== null)
    newImages.forEach((img, index) => {
      formData.append(`img_${index + 1}`, img)
      formData.append(`has_new_img_${index + 1}`, 'true')
    })

    existingImgs.forEach((img, index) => {
      if (img && !imgsToDelete.includes(img.name)) {
        formData.append(`existing_img_${index + 1}`, img.name)
      }
    })

    try {
      await editCourse(props.courseId, formData)
      Swal.fire({
        icon: 'success',
        title: '課程已更新',
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        props.fetchCourses() // 立即更新課程列表
        props.onHide()
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '課程更新失敗',
        showConfirmButton: false,
        timer: 1000,
      })
    }
  }

  const handleImgMainChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImgMain(file)
      setImgMainFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImgMainPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImgMain(null)
      setImgMainPreview(null)
      setImgMainFileName('未選擇任何檔案')
    }
  }
  const handleImgsChange = (e) => {
    let files = Array.from(e.target.files)

    if (files.length > 3) {
      Swal.fire({
        icon: 'error',
        title: '最多只能上傳三張圖片',
        showConfirmButton: false,
        timer: 1000,
      })
      files = files.slice(0, 3)
    }

    // 使用暫存變量來追踪圖片
    let tempImg1 = img1
    let tempImg2 = img2
    let tempImg3 = img3

    files.forEach((file) => {
      if (!tempImg1) {
        tempImg1 = file
      } else if (!tempImg2) {
        tempImg2 = file
      } else if (!tempImg3) {
        tempImg3 = file
      }
    })

    // 更新狀態
    setImg1(tempImg1)
    setImg2(tempImg2)
    setImg3(tempImg3)

    // 更新圖片預覽
    const previews = [
      tempImg1 ? URL.createObjectURL(tempImg1) : null,
      tempImg2 ? URL.createObjectURL(tempImg2) : null,
      tempImg3 ? URL.createObjectURL(tempImg3) : null,
    ].filter(Boolean)

    setImgsPreviews(previews)
    setImgsFileNames(
      [tempImg1, tempImg2, tempImg3]
        .filter(Boolean)
        .map((file) => file.name)
        .join(', ')
    )
  }
  const handleRemoveExistingImg = async (imgName) => {
    try {
      // 確定要刪除的是哪個圖片欄位
      let imageField
      if (props.courseData.img_1 === imgName) imageField = 'img_1'
      else if (props.courseData.img_2 === imgName) imageField = 'img_2'
      else if (props.courseData.img_3 === imgName) imageField = 'img_3'

      if (imageField) {
        await deleteCourseImage(props.courseId, imageField)

        setExistingImgs((prevImgs) =>
          prevImgs.filter((img) => img.name !== imgName)
        )

        // 更新courseData以反映圖片已被刪除
        props.setCourseData((prevData) => ({
          ...prevData,
          [imageField]: null,
        }))

        console.log('success')
      }
    } catch (error) {
      console.error('刪除圖片時出錯:', error)
    }
  }

  const toggleValid = () => {
    setValid((prevValid) => (prevValid === 1 ? 0 : 1))
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      size="lg"
      aria-labelledby="editCourseModal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="editCourseModal"
          style={{
            fontSize: '2rem',
            color: '#1b3947',
          }}
        >
          編輯課程
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
            <Form.Label>課程名稱</Form.Label>
            <Form.Control
              type="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ fontSize: '1.6rem', borderColor: '' }}
            ></Form.Control>
          </Form.Group>

          <Form.Group
            controlId="formTagSelect"
            className="mt-3"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'start',
              gap: '32px',
              width: '320px',
            }}
          >
            <div>
              <Form.Label>類別1</Form.Label>
              <Form.Control
                as="select"
                value={selectTag1}
                onChange={(e) => setSelectTag1(e.target.value)}
                style={{ fontSize: '1.6rem', minWidth: '160px' }}
              >
                <option value="">選擇類別1</option>
                {coursetags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.tagname}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div>
              <Form.Label>類別2</Form.Label>
              <Form.Control
                as="select"
                value={selectTag2}
                onChange={(e) => setSelectTag2(e.target.value)}
                style={{ fontSize: '1.6rem', minWidth: '160px' }}
              >
                <option value="">選擇類別2</option>
                {coursetags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.tagname}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Form.Group>

          <Form.Group controlId="formImgmSelect">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                gap: '16px',
              }}
            >
              <div>
                <Form.Label>課程主圖片</Form.Label>
                <div
                  onClick={() => imgMainInputRef.current.click()}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderColor: errors.imgMain ? 'red' : '',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#f8f9fa',
                    minWidth: '300px',
                  }}
                >
                  <FaFileUpload size={24} />
                  <span>點擊更新主圖片</span>
                </div>
                <small style={{ marginLeft: '10px', color: '#6c757d' }}>
                  {/* {imgMainFileName} */}
                </small>
                <Form.Control
                  type="file"
                  ref={imgMainInputRef}
                  onChange={handleImgMainChange}
                  style={{ display: 'none' }}
                />
                {errors.imgMain && (
                  <Form.Text className="text-danger">
                    {errors.imgMain}
                  </Form.Text>
                )}
                {imgMainPreview && (
                  <div style={{ marginTop: '10px' }}>
                    <Image
                      src={imgMainPreview}
                      alt="Image Preview"
                      width={100}
                      height={100}
                    />
                  </div>
                )}
              </div>

              <div>
                <Form.Label>課程介紹圖片 (最多3張)</Form.Label>
                <div
                  onClick={() => imgsInputRef.current.click()}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderColor: errors.imgs ? '#2b4f61' : '',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <FaFileUpload size={24} style={{ color: '#2b4f61' }} />
                  <span>點擊更新介紹圖片</span>
                </div>
                <small style={{ marginLeft: '10px', color: '#6c757d' }}>
                  {/* {imgsFileNames} */}
                </small>
                <Form.Control
                  type="file"
                  ref={imgsInputRef}
                  multiple
                  onChange={handleImgsChange}
                  style={{ display: 'none' }}
                />
                {errors.imgs && (
                  <Form.Text className="text-danger">{errors.imgs}</Form.Text>
                )}
                <div
                  style={{ marginTop: '10px', display: 'flex', gap: '10px' }}
                >
                  {existingImgs.map((img, index) => (
                    <div
                      key={index}
                      style={{ position: 'relative', display: 'inline-block' }}
                    >
                      <Image
                        src={img.src}
                        alt={`Image Preview ${index + 1}`}
                        width={100}
                        height={100}
                      />
                      <FaTimes
                        onClick={() => handleRemoveExistingImg(img.name)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          cursor: 'pointer',
                          color: 'red',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          padding: '2px',
                        }}
                      />
                    </div>
                  ))}
                  {imgsPreviews.map((src, index) => (
                    <Image
                      key={index}
                      src={src}
                      alt={`Image Preview ${index + 1}`}
                      width={100}
                      height={100}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Form.Group>

          <Form.Group
            controlId="formTeacherPriceSelect"
            className="mt-3"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'start',
              gap: '32px',
            }}
          >
            <div>
              <Form.Label>老師</Form.Label>
              <Form.Control
                as="select"
                value={selectTeacher}
                onChange={(e) => setSelectTeacher(e.target.value)}
                style={{ fontSize: '1.6rem' }}
              >
                <option value="">選擇師資</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div>
              <Form.Label>價格</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ fontSize: '1.6rem' }}
              />
            </div>
          </Form.Group>

          <Form.Group controlId="formContent" className="mt-3">
            <Form.Label>課程內容</Form.Label>
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              style={{ fontSize: '1.6rem', minHeight: '100px' }}
            />
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
