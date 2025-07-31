// 商品的 API 回傳處理
const extractProducts = (resData) =>
  resData.status === 'success' ? resData.data.products : []
