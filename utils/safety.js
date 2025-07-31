/* 消毒: 防止 XSS  */

// 消毒單個字串
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str

  return str

    .replace(/&/g, '&amp;') // 把 & 替換成 &amp;，避免後續插入其它 HTML entity 被錯誤解析
    .replace(/</g, '&lt;') // 把 < 轉為 &lt;，避免被解析為 HTML 標籤（如 <script>）
    .replace(/>/g, '&gt;') // 把 > 轉為 &gt;，同上，避免 HTML 結束標籤造成影響
    .replace(/"/g, '&quot;') // 把 "（雙引號）轉為 &quot;，避免破壞屬性欄位，如 <input value="...">
    .replace(/'/g, '&#x27;') // 把 '（單引號）轉為 &#x27;，同上，用於 HTML 或 JS 屬性
}

// 遞迴消毒整個物件（陣列、物件、字串）
export function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return sanitizeInput(obj)
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  } else if (obj !== null && typeof obj === 'object') {
    const sanitized = {}
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key])
    }
    return sanitized
  } else {
    return obj // 數字、布林、null、undefined 等原樣回傳
  }
}
