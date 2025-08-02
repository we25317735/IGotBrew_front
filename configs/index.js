import 'dotenv/config.js' // .env 檔案載入(共用api部分)

export const PORT = 3000
export const DEV = true

// express 的位置
export const apiBaseUrl = process.env.NEXT_PUBLIC_BACK_API
export const avatarBaseUrl = 'http://localhost:3005/avatar'
