import axios from 'axios'
import qs from 'qs'
import { PREFIX_URL, UAID } from './config'
import { getKey } from 'common/js/util'

export function addOrder(token, score, paytype, price) {
  const url = `${PREFIX_URL}/add_order`
  return axios.post(url, qs.stringify({
    token: token,
    score: score,
    pay_type: paytype,
    price: price,
    uaid: UAID,
    key: getKey()
  })).then(function(res) {
    return Promise.resolve(res)
  })
}
