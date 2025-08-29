import axios from 'axios'
import { apiBaseUrl } from '@/configs'

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 8000,
  withCredentials: true,
})

export default axiosInstance
