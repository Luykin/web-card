import axios from 'axios'
// import qs from 'qs'
import { PREFIX_URL } from './config'
import { getKey } from 'common/js/util'

export function getTasks(token, num, page) {
  const url = `${PREFIX_URL}/tasks`
  return axios.get(url, {
    params: {
      token: token,
      num: num,
      page: page,
      key: getKey()
    }
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
export function custom(url) {
  return axios.get(url).then(function(res) {
    return Promise.resolve(res)
  })
}
