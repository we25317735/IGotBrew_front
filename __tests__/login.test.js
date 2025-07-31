// import RegisterModule from "@/components/authForm/components/register_module"
// import { render, screen, fireEvent, waitFor } from "@testing-library/react"
// import axios from "axios"
// import { RouterContext } from "next/dist/shared/lib/router-context"
// import { createMockRouter } from "next-router-mock"
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// // 模擬 axios
// jest.mock("axios")

// // 模擬 useAuth hook
// jest.mock('@/hooks/use-auth.js', () => ({
//   useAuth: jest.fn(() => ({
//     auth: { user: 'mockUser' },
//     setAuth: jest.fn(),
//   })),
// }));

// describe("註冊表單測試", () => {
//   it("如果成功回傳 200 並跳轉到首頁", async () => {
//     // 建立 mock router
//     const mockPush = jest.fn()
//     const mockRouter = createMockRouter({ push: mockPush })

//     // 模擬註冊成功（JWT + 查詢 user 資料）
//     axios.post.mockResolvedValueOnce({
//       data: {
//         status: "success",
//         data: {
//           accessToken: "mocked-token", // 對 parseJwt() 有效
//         },
//       },
//     })

//     // 模擬 getUserById 成功
//     axios.get.mockResolvedValueOnce({
//       data: {
//         status: "success",
//         data: {
//           id: 1,
//           name: "Test User",
//           email: "test@example.com"
//         },
//       },
//     })

//     render(
//       <RouterContext.Provider value={mockRouter}>
//         <>
//           <RegisterModule />
//           <ToastContainer /> {/* 顯示 toast 的必要元素 */}
//         </>
//       </RouterContext.Provider>
//     )

//     // 找 input
//     const emailInput = screen.getByPlaceholderText("請輸入您的電子郵件")
//     const passwordInput = screen.getByPlaceholderText("請設定您的密碼")
//     const passwordCheck = screen.getByPlaceholderText("請再次輸入密碼")
//     const submitButton = screen.getByText("註冊")

//     // 模擬輸入
//     fireEvent.change(emailInput, { target: { value: "we25317735@gmail.com" } })
//     fireEvent.change(passwordInput, { target: { value: "12345678" } })
//     fireEvent.change(passwordCheck, { target: { value: "12345678" } })

//     // 點擊註冊
//     fireEvent.click(submitButton)

//     // 等待 router.push 被呼叫
//     await waitFor(() => {
//       expect(mockPush).toHaveBeenCalledWith('/IGotBrew')
//     })

//     // 你也可以加上 toast 的檢查（選擇性）
//     await waitFor(() => {
//       expect(screen.getByText(/註冊成功/)).toBeInTheDocument()
//     })
//   })
// })
