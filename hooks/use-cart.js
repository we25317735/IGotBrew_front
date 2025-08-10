import React, { useState, useEffect, createContext, useContext } from 'react'
import { useAuth } from '@/hooks/use-auth'

const initItems = [] // 購物車項目清單

// 購物車初始訊息, cartItems 最初的設定
const initState = {
  items: initItems,
  isEmpty: true, // 購物車是否為空
  totalItems: 0, // 購物車內總商品數量(initItems 對應 quantity)
  cartTotal: 0, // 購物車總金額(initItems 對應 price)
}

/* 購車車設置範例 */
// const initItems = [
//   {
//     id: 'abc123',        // 商品唯一識別碼
//     name: '咖啡豆A',       // 商品名稱（可選，但利於顯示）
//     price: 350,          // 商品單價（必要，用來計算 cartTotal）
//     quantity: 2,         // 商品數量（必要，用來計算 totalItems 與 cartTotal）
//     // 其他可選欄位
//     image: 'xxx.jpg',
//     type: 'bean',
//   },
//   ...
// ]

// 尋找指定 id 的項目
const findOneById = (items, id) => {
  return items.find((item) => String(item.id) === String(id)) || {}
}

// 更新指定 id 的項目
const updateOne = (items, updateItem) => {
  return items.map((item) => {
    if (String(item.id) === String(updateItem.id)) return updateItem
    else return item
  })
}

// 將新項目加入 items 中，如果已存在則增加數量
const addOne = (items, newItem) => {
  const foundIndex = items.findIndex(
    (item) => String(item.id) === String(newItem.id)
  )

  if (foundIndex > -1) {
    const item = items[foundIndex]
    const newQuantity = item.quantity + newItem.quantity
    return updateOne(items, { ...item, quantity: newQuantity })
  }

  return [...items, newItem]
}

// 移除指定 id 的項目
const removeOne = (items, id) => {
  return items.filter((item) => String(item.id) !== String(id))
}

// 計算每項目的小計
const subtotalPrice = (items) =>
  items.map((item) => ({
    ...item,
    subtotal: item.price * item.quantity,
  }))

// 計算整體總價
const totalPrice = (items) =>
  items.reduce((total, item) => total + item.quantity * item.price, 0)

// 計算整體項目數量
const totalItems = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)

// 初始購物車的狀態(初次載入畫面時)
const generateCartState = (state, items) => {
  const isEmpty = items.length === 0

  return {
    ...initState,
    ...state,
    items: subtotalPrice(items),
    totalItems: totalItems(items),
    cartTotal: totalPrice(items),
    isEmpty, // 購物車是否為空
  }
}

// 初始化
const init = (items) => {
  return generateCartState({}, items)
}

const CartContext = createContext(null)

export const CartProvider = ({ children, initialCartItems = [] }) => {
  const { auth } = useAuth()
  const [cartItems, setCartItems] = useState(initItems) // 最初的購物車陣列
  const [cartState, setCartState] = useState(init(initialCartItems)) // 購物車全狀態(包含 cartItems)
  const [cartCheckout, setCartCheckout] = useState() // 存放結帳時的狀態(確認訂單組件適用)
  const userCartKey = auth.userData.name ? `${auth.userData.name}_cart` : null

  // 當 auth.userData.name 存在時，從 localStorage 中讀取購物車數據
  useEffect(() => {
    if (auth.userData.name && userCartKey) {
      const storedCart = localStorage.getItem(userCartKey)
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
    }
  }, [auth.userData.name, userCartKey])

  // 監聽最新的購物車狀態( CRUD ), 並更新 cartState（如總價、總數量等）
  useEffect(() => {
    /* 購物車的物件被動過後, 代表所有狀態的 cartState 也要進一步更新 */
    setCartState(generateCartState(cartState, cartItems))
  }, [cartItems])

  // 監聽最新的購物車狀態( CRUD ), 並更新 localStorage
  useEffect(() => {
    // 如果購物車有東西,新增 localStorage 並加入
    if (cartItems.length > 0 && userCartKey) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(userCartKey, JSON.stringify(cartItems))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [cartItems, userCartKey])

  const addItem = (item) => {
    setCartItems(addOne(cartItems, item))
  }

  const removeItem = (id) => {
    setCartItems(removeOne(cartItems, id))
  }

  const updateItemQty = (id, quantity) => {
    const item = findOneById(cartItems, id)
    if (!item.id) return
    const updatedItem = { ...item, quantity }
    setCartItems(updateOne(cartItems, updatedItem))
  }

  const clearCart = (e) => {
    // setCartItems([]) // 清空購物車

    // 直接清除 localStorage
    if (userCartKey) {
      localStorage.removeItem(userCartKey) // 同時從 localStorage 中移除數據
    }
  }

  // 刪除購物車所有內容, 只留一個(單樣商品結帳)
  const onlyOneItem = (item) => {
    setCartItems([item])
  }

  const isInCart = (id) => {
    return cartItems.some((item) => item.id === id)
  }

  return (
    <CartContext.Provider
      value={{
        cart: cartState,
        cartItems: cartState.items,
        totalItems: cartState.totalItems, // 總件數(全部數量)
        totalPrice: cartState.cartTotal, // 總金額
        cartCheckout, // 結帳時狀態
        setCartCheckout, // 儲存結帳時狀態
        addItem,
        removeItem,
        updateItemQty,
        clearCart,
        isInCart,
        onlyOneItem, // 只保留傳進來的項目(直接結帳)
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
