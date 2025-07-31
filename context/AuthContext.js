import React, { createContext, useState, useEffect } from 'react'

// 建立一個名為 AuthContext 的上下文（context）
export const AuthContext = createContext(null)

// 建立 AuthProvider 元件，作為提供認證相關狀態和功能的容器
export const AuthProvider_1 = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(false)

  return (
    <AuthContext.Provider value={{ isAllowed, setIsAllowed }}>
      {children}
    </AuthContext.Provider>
  )
}
