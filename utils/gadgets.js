import Swal from 'sweetalert2'

/* loading 開關 */
export const loadingON = (title, msg) => {
  Swal.fire({
    title: title,
    text: msg,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

export const loadingOff = () => {
  Swal.close() // 關閉 sweetalert 的 loading
}
/* loading 開關 結束 */
