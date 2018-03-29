import axios from 'axios'
// import qs from 'qs'
import { PREFIX_URL, UAID } from './config'
import { getKey } from 'common/js/util'

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
