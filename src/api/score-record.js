import axios from 'axios'
// import qs from 'qs'
// , UAID
import { PREFIX_URL } from './config'
import { getSign } from 'common/js/util'

export function getOrders(token, num, page, code) {
  const url = `${PREFIX_URL}/orders`
  let data = {
    token: token,
    num: num,
    page: page
  }
  if (code) {
    data = Object.assign({ code: code }, data)
  }
  return axios.get(url, {
      params: Object.assign({ sign: getSign(data) }, data)
    })
    .then(function(res) {
      return Promise.resolve(res)
    })
    .catch(function(error) {
      if (error.response) {
        // console.log(error.response.data)
        console.log(error.response.status)
        // console.log(error.response.headers)
        return Promise.resolve({
          data: {
            err_code: error.response.status,
            err_msg: error.response.status
          }
        })
      } else {
        return Promise.resolve({
          data: {
            err_code: -1,
            err_msg: -1
          }
        })
      }
    })
}
