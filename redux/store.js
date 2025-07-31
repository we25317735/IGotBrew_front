import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '@/redux/slices/counterSlice'
import paginationReducer from '@/redux/slices/paginationSlice'

// useSelector 會來讀取這邊的 reducer(接收器) 來連接對應的函數
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    pagination: paginationReducer,
  },
})
