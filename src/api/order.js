import axios from 'axios'
// import qs from 'qs'
import { PREFIX_URL } from './config'
import { getSign } from 'common/js/util'

export function getTasks(token, num, page, id) {
  const url = `${PREFIX_URL}/tasks`
  let data = {
    token: token,
    num: num,
    page: page
  }
  if (id) {
    data = Object.assign({ service_category_id: id }, data)
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
export function getFanProjectOrders(token, num, page, id) {
  const url = `${PREFIX_URL}/fan_project_orders`
  let data = {
    token: token,
    num: num,
    page: page
  }
  if (id) {
    data = Object.assign({ service_category_id: id }, data)
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
export function custom(addition) {
  const url = `${PREFIX_URL}/tasks`
  let data = {
    token: token,
    addition: addition
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
