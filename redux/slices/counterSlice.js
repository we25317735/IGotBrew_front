import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter', // useSelector() 時可以指名

  initialState: {
    // 初始化狀態
    value: 0,
    ALAD: '謝謝',
  },
  reducers: {
    // 定義 reducers（處理狀態變更的函數）
    increment: (state) => {
      state.value += 1 // 當調用 increment action 時，value 增加 1
    },
    decrement: (state) => {
      state.value -= 1 // 當調用 decrement action 時，value 減少 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload // 當調用 incrementByAmount action 時，value 增加 action.payload 的值
    },
  },
})

export const { increment, decrement } = counterSlice.actions
export default counterSlice.reducer
