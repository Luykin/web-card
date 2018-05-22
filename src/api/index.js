import axios from 'axios'
import qs from 'qs'
import { PREFIX_URL, UAID } from './config'
import { getSign } from 'common/js/util'

export function getServiceCategory(sub_domain) {
  const url = `${PREFIX_URL}/service_category`
  let data = {
    uaid: UAID
  }
  if (sub_domain) {
    data = Object.assign({ sub_domain: sub_domain }, data)
  }
  return axios.get(url, {
    params: Object.assign({ sign: getSign(data) }, data)
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
export function getServices(id) {
  const url = `${PREFIX_URL}/services`
  let data = {
    uaid: UAID,
    service_category_id: id
  }
  return axios.get(url, {
    params: Object.assign({ sign: getSign(data) }, data)
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
export function getAppInfo() {
  const url = `${PREFIX_URL}/app_info`
  let data = {
    uaid: UAID
  }
  return axios.get(url, {
    params: Object.assign({ sign: getSign(data) }, data)
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
export function addTask(score, point, token, serviceid, addition, targetid, sublimeTime) {
  const url = `${PREFIX_URL}/add_task`
  let data = {
    score: score,
    point: point,
    token: token,
    service_id: serviceid,
    uaid: UAID,
    addition: addition
  }
  if (targetid) {
    data = Object.assign({ target_id: targetid }, data)
  }
  if (sublimeTime) {
    data = Object.assign({ appointment_time: sublimeTime }, data)
  }
  return axios.post(url, qs.stringify(Object.assign({ sign: getSign(data) }, data)))
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
export function getUserInfo(token) {
  const url = `${PREFIX_URL}/user_info`
  let data = {
    token: token
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
export function getShuoshuoList(qq, token) {
  const url = `${PREFIX_URL}/get_shuoshuo_list`
  let data = {
    qq: qq,
    token: token
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
export function getsubsite(sub_domain) {
  const url = `${PREFIX_URL}/sub_site`
  let data = {
    uaid: UAID,
    sub_domain: sub_domain
  }
  return axios.post(url, qs.stringify(Object.assign({ sign: getSign(data) }, data)))
    .then(function(res) {
      return Promise.resolve(res)
    }).catch(function(error) {
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
