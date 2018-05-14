import axios from 'axios'
// import qs from 'qs'
import { PREFIX_URL, UAID } from './config'
// import { getKey } from 'common/js/util'

export function getScoreRate() {
  const url = `${PREFIX_URL}/config`
  return axios.get(url, {
      params: {
        uaid: UAID,
        k: 'score_rate'
      }
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
