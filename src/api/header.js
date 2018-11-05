import axios from 'axios'
import qs from 'qs'
import {
  PREFIX_URL,
  UAID
} from './config'
import {
  getSign,
  isPhone,
  isWx
} from 'common/js/util'

// export function getAccessToken(appid, appSecret) {
//   const url = 'https://api.weixin.qq.com/cgi-bin/token'
//   let data = {
//     grant_type: 'client_credential',
//     appid: appid,
//     appSecret: appSecret
//   }
//   return axios.get(url, {
//     params: Object.assign({
//       sign: getSign(data)
//     }, data)
//   }).then(function(res) {
//     return Promise.resolve(res)
//   })
// }

// export function getWXACode(appid, appSecret) {
//   const url = 'https://api.weixin.qq.com/wxa/getwxacode'
//   let data = {
//     grant_type: 'client_credential',
//     appid: appid,
//     appSecret: appSecret
//   }
//   return axios.get(url, {
//     params: Object.assign({
//       sign: getSign(data)
//     }, data)
//   }).then(function(res) {
//     return Promise.resolve(res)
//   })
// }

export function addOrder(token, score, paytype, price, id) {
  const url = `${PREFIX_URL}/add_order`
  let data = {
    token: token,
    score: score,
    pay_type: paytype,
    price: price,
    uaid: UAID
  }
  // if (id || id === 0) {
  //   data = Object.assign({
  //     good_id: id
  //   }, data)
  // }
  if (isPhone() && !isWx()) {
    data = Object.assign({
      device: 'phone'
    }, data)
  } else {
    if (isWx()) {
      data = Object.assign({
        device: 'wx'
      }, data)
    } else {
      data = Object.assign({
        device: 'pc'
      }, data)
    }
  }
  // Object.assign(data, {
  //   device: 'wx'
  // })
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
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
export function agency(token, company, proposer, phone, email, remarks) {
  const url = `${PREFIX_URL}/agency`
  let data = {
    token: token,
    company: company,
    proposer: proposer,
    phone: phone,
    email: email
  }
  if (remarks) {
    data = Object.assign({
      remarks: remarks
    }, data)
  }
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
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