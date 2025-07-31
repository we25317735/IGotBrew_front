import React, { useEffect } from 'react'
import axios from 'axios'

export default function TestPage() {
  // const url = "http://localhost:3005/api/api/TestPage/search"; // get API (抓資料)
  const url = 'http://localhost:3005/api/api/TestPage/craet' // post API (增加, 搜尋資料)
  // const url = "http://localhost:3005/api/api/TestPage/updata"; // put API (更改資料)
  // const url = "http://localhost:3005/api/api/TestPage/remove"; // delete API (刪除資料)

  useEffect(() => {
    // 寫在 useEffect 裡面, 確保不會錯過資料

    /* 根據需求更改 axios 後面的指令(.get 或 .post 之類)來對應4不同路由 */

    // 取得資料
    // axios.get(url)
    //   .then((res)=>{
    //     // console.log(res.data); // 取出的數據會在這裡(如果順利的話)
    //     GetData(res.data); // 把數值傳到自訂義函數裡,並在那裏做事(這部分是個人習慣操作)
    //   }).catch((err)=>{
    //     console.log(err);
    //   });

    // 增加, 搜尋資料
    axios
      .post(url, {
        msg: '想傳給後端的東西',
        msg_2: '想讓後端知道的訊息',
      })
      .then((res) => {
        // console.log(res.data);
        PostData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  // 用 .get 取得的函數
  const GetData = (e) => {
    console.log(e)
  }

  // 用 .post 取得的函數
  const PostData = (e) => {
    console.log(e)
  }

  return <h1></h1>
}
