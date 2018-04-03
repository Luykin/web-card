import axios from 'axios'
// import qs from 'qs'
// , UAID
import { PREFIX_URL } from './config'
import { getKey } from 'common/js/util'

export function getOrders(token, num, page) {
  const url = `${PREFIX_URL}/orders`
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
