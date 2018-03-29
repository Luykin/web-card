import axios from 'axios'
// import qs from 'qs'
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
