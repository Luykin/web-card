import axios from 'axios'
import qs from 'qs'
import { PREFIX_URL, UAID } from './config'
import { getKey } from 'common/js/util'

export function getServiceCategory() {
  const url = `${PREFIX_URL}/service_category`
  return axios.get(url, {
    params: {
      uaid: UAID,
      key: getKey()
    }
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
export function getServices(id) {
  const url = `${PREFIX_URL}/services`
  return axios.get(url, {
    params: {
      uaid: UAID,
      key: getKey(),
      service_category_id: id
    }
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
export function getScoreRate() {
  const url = `${PREFIX_URL}/config`
  return axios.get(url, {
    params: {
      uaid: UAID,
      k: 'score_rate',
      key: getKey()
    }
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
export function addTask(point, token, serviceid, addition) {
  const url = `${PREFIX_URL}/add_task`
  return axios.post(url, qs.stringify({
    point: point,
    token: token,
    service_id: serviceid,
    uaid: UAID,
    addition: addition,
    key: getKey()
  })).then(function(res) {
    return Promise.resolve(res)
  })
}
export function getUserInfo(token) {
  const url = `${PREFIX_URL}/user_info`
  return axios.get(url, {
    params: {
      token: token,
      key: getKey()
    }
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
