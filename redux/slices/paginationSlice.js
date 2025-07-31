// features/paginationSlice.js
import { createSlice } from '@reduxjs/toolkit'

const paginationSlice = createSlice({
  name: 'pagination', // useSelector() 時可以指名

  initialState: {
    total: 5, // 總頁數
    currentPage: 1, // 當前頁
  },

  reducers: {
    setTotal: (state, action) => {
      // state(本身的狀態), action(接收傳來的東西)
      state.total = action.payload // payload: 攜帶用來更新狀態的數據
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
})

export const { setTotal, setCurrentPage } = paginationSlice.actions
export default paginationSlice.reducer
