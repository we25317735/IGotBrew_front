import React, { useState, useEffect, useRef } from 'react'
import useCourseApi from '../../../services/courseApi'
import { Modal, Button, Form } from 'react-bootstrap'
import { FaFileUpload } from 'react-icons/fa'
import Swal from 'sweetalert2'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function CreateCourse(props) {
  const { createCourse, courses, coursetags, teachers } = useCourseApi()
  const [name, setName] = useState('')
  const [selectTag1, setSelectTag1] = useState('')
  const [selectTag2, setSelectTag2] = useState('')
  const [imgMain, setImgMain] = useState(null)
  const [imgMainPreview, setImgMainPreview] = useState(null)
  const [imgMainFileName, setImgMainFileName] = useState('未選擇任何檔案')
  const [imgsFileNames, setImgsFileNames] = useState('未選擇任何檔案')
  const [errors, setErrors] = useState({})

  const [selectTeacher, setSelectTeacher] = useState('')
  const [content, setContent] = useState('')
  const [img1, setImg1] = useState(null)
  const [img2, setImg2] = useState(null)
  const [img3, setImg3] = useState(null)
  const [imgsPreviews, setImgsPreviews] = useState([])
  const [price, setPrice] = useState('')
  const [sold] = useState(0)
  const [valid, setValid] = useState(1)
  const router = useRouter()

  // 使用 useRef 來獲取 input 元素的參考
  const imgMainInputRef = useRef(null)
  const imgsInputRef = useRef(null)

  const handleCreate = async () => {
    const newErrors = {}

    if (!name) newErrors.name = '必填'
    if (!selectTag1) newErrors.selectTag1 = '必選'
    if (!selectTag2) newErrors.selectTag2 = '必選'
    if (!selectTeacher) newErrors.selectTeacher = '必選'
    if (!price) newErrors.price = '必填'
    if (!content) newErrors.content = '必填'
    if (!imgMain) newErrors.imgMain = '必須上傳'
    if (!img1 && !img2 && !img3) newErrors.imgs = '至少需要上傳一張介紹圖片'

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

    const formData = new FormData()
    if (imgMain) formData.append('img_main', imgMain)
    if (img1) formData.append('img_1', img1)
    if (img2) formData.append('img_2', img2)
    if (img3) formData.append('img_3', img3)
    formData.append('name', name)
    formData.append('tag1', selectTag1)
    formData.append('tag2', selectTag2)
    formData.append('teacher_id', selectTeacher)
    formData.append('content', content)
    formData.append('price', price)
    formData.append('sold', sold)
    formData.append('valid', valid)

    try {
      await createCourse(formData)
      Swal.fire({
        icon: 'success',
        title: '課程新增成功',
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        props.fetchCourses() // 立即更新課程列表
        setName('')
        setSelectTag1('')
        setSelectTag2('')
        setImgMain(null)
        setImgMainPreview(null)
        setImgMainFileName('未選擇任何檔案')
        setImgsFileNames('未選擇任何檔案')
        setSelectTeacher('')
        setContent('')
        setImg1(null)
        setImg2(null)
        setImg3(null)
        setImgsPreviews([])
        setPrice('')
        setValid(1)
        props.onHide() // 關閉表單
      })
      props.onHide()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '課程新增失敗',
        showConfirmButton: false,
        timer: 1000,
      })
    }
  }
  // 用於清除錯誤信息的函數
  const handleChange = (field, value) => {
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }))
    }
    if (field === 'name') setName(value)
    if (field === 'selectTag1') setSelectTag1(value)
    if (field === 'selectTag2') setSelectTag2(value)
    if (field === 'selectTeacher') setSelectTeacher(value)
    if (field === 'price') setPrice(value)
    if (field === 'content') setContent(value)
  }

  const handleImgMainChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImgMain(file)
      setImgMainFileName(file.name) // 在這裡設置檔案名稱
      const reader = new FileReader()
      reader.onloadend = () => {
        setImgMainPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImgMain(null)
      setImgMainPreview(null)
    }
    handleChange('imgMain', file)
  }

  const handleImgsChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length > 3) {
      Swal.fire({
        icon: 'error',
        title: '最多只能上傳三張圖片',
        showConfirmButton: false,
        timer: 1000,
      })

      // 只保留前三個檔案
      const limitedFiles = files.slice(0, 3)
      setImg1(limitedFiles[0] || null)
      setImg2(limitedFiles[1] || null)
      setImg3(limitedFiles[2] || null)

      const previews = limitedFiles.map((file) => URL.createObjectURL(file))
      setImgsPreviews(previews)
      setImgsFileNames(limitedFiles.map((file) => file.name).join(', '))
    } else {
      setImg1(files[0] || null)
      setImg2(files[1] || null)
      setImg3(files[2] || null)

      const previews = files.map((file) => URL.createObjectURL(file))
      setImgsPreviews(previews)
      setImgsFileNames([...files].map((file) => file.name).join(', '))
    }
    handleChange('imgs', files)
  }

  const toggleValid = () => {
    setValid((prevValid) => (prevValid === 1 ? 0 : 1))
  }
  //預設填入
  const handlePresetFill = () => {
    setName('咖啡歷史與品味咖啡')
    setSelectTag1(
      coursetags.find((tag) => tag.tagname === '咖啡體驗')?.id || ''
    )
    setSelectTag2(
      coursetags.find((tag) => tag.tagname === '咖啡知識')?.id || ''
    )
    setSelectTeacher(
      teachers.find((teacher) => teacher.name === '陳秉超')?.id || ''
    )
    setPrice('6800')
    setContent(
      `2023年末主題為『從咖啡歷史看不同的咖啡沖煮』，傳說18世紀初牧羊人發現他們羊吃了一種特別的神秘果實開起了咖啡的世界，咖啡在世界各地蓬勃發展，融合當地的文化與生活習慣，造就了現在如此美妙的咖啡飲品文化 ! 就讓我們透過有趣的歷史分享來認識不同的咖啡沖煮方式，以及品味他們獨特的風味，本次會品嘗到非常難得見到的土耳其式的咖啡、義大利媽媽的摩卡魔法、充滿儀式感的虹吸式咖啡，還有現在流行的淺烘焙手沖咖啡。一次讓您打開味蕾享受不同的咖啡驚艷！！`
    )
  }
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      size="lg"
      aria-labelledby="createCourseModal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="createCourseModal"
          style={{
            fontSize: '2rem',
            color: '#1b3947',
          }}
        >
          新增課程
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
              type="input"
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              style={{
                fontSize: '1.6rem',
                borderColor: errors.name ? 'red' : '',
              }}
            ></Form.Control>
            {errors.name && (
              <Form.Text className="text-danger">{errors.name}</Form.Text>
            )}
          </Form.Group>

          <Form.Group
            controlId="formTagSelect"
            className="mt-3"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              gap: '4px',
            }}
          >
            <Form.Label>課程類別</Form.Label>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                gap: '32px',
                width: '320px',
              }}
            >
              <div>
                <Form.Control
                  as="select"
                  value={selectTag1}
                  onChange={(e) => handleChange('selectTag1', e.target.value)}
                  style={{
                    fontSize: '1.6rem',
                    borderColor: errors.selectTag1 ? 'red' : '',
                    minwidth: '160px',
                  }}
                >
                  <option value="">類別1</option>
                  {coursetags &&
                    coursetags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.tagname}
                      </option>
                    ))}
                </Form.Control>
                {errors.selectTag1 && (
                  <Form.Text className="text-danger">
                    {errors.selectTag1}
                  </Form.Text>
                )}
              </div>
              <div>
                <Form.Control
                  as="select"
                  value={selectTag2}
                  onChange={(e) => handleChange('selectTag2', e.target.value)}
                  style={{
                    fontSize: '1.6rem',
                    borderColor: errors.selectTag2 ? 'red' : '',
                  }}
                >
                  <option value="">類別2</option>
                  {coursetags &&
                    coursetags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.tagname}
                      </option>
                    ))}
                </Form.Control>
                {errors.selectTag2 && (
                  <Form.Text className="text-danger">
                    {errors.selectTag2}
                  </Form.Text>
                )}
              </div>
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
                  <span>點擊上傳主圖片</span>
                </div>
                <small style={{ marginLeft: '10px', color: '#6c757d' }}>
                  {imgMainFileName}
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
                    borderColor: errors.imgs ? 'red' : '',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <FaFileUpload size={24} />
                  <span>點擊上傳介紹圖片</span>
                </div>
                <small style={{ marginLeft: '10px', color: '#6c757d' }}>
                  {imgsFileNames}
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
                onChange={(e) => handleChange('selectTeacher', e.target.value)}
                style={{
                  fontSize: '1.6rem',
                  borderColor: errors.selectTeacher ? 'red' : '',
                }}
              >
                <option value="">選擇師資</option>
                {teachers &&
                  teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
              </Form.Control>
              {errors.selectTeacher && (
                <Form.Text className="text-danger">
                  {errors.selectTeacher}
                </Form.Text>
              )}
            </div>
            <div>
              <Form.Label>價格</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => handleChange('price', e.target.value)}
                style={{
                  fontSize: '1.6rem',
                  borderColor: errors.price ? 'red' : '',
                }}
              />
              {errors.price && (
                <Form.Text className="text-danger">{errors.price}</Form.Text>
              )}
            </div>
          </Form.Group>

          <Form.Group controlId="formContent">
            <Form.Label>課程內容</Form.Label>
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={3}
              style={{
                fontSize: '1.6rem',
                borderColor: errors.content ? 'red' : '',
              }}
            />
            {errors.content && (
              <Form.Text className="text-danger">{errors.content}</Form.Text>
            )}
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
