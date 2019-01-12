import axios from 'axios'
import qs from 'qs'
import {PREFIX_URL} from './config'
import {getSign, getTime} from './util'

export function subject_list() {
  const url = `${PREFIX_URL}/subject/list`;
  let data = {
    show_list: 'all'
  };
  return axios.post(url, qs.stringify(Object.assign(data, {'_sg': getSign(data)})))
    .then((res) => {
      return Promise.resolve(res)
    })
    .catch((error) => {
      return Promise.resolve({
        err_code: error.response.status,
        err_msg: error.response.status
      })
    })
}

export function train_list(id_list) {
  const url = `${PREFIX_URL}/trainingSet/list`;
  let data = {
    id_list
  };
  return axios.post(url, qs.stringify(Object.assign(data, {'_sg': getSign(data)})))
    .then((res) => {
      return Promise.resolve(res)
    })
    .catch((error) => {
      return Promise.resolve({
        err_code: error.response.status,
        err_msg: error.response.status
      })
    })
}


export function cardSet_list(id_list) {
  const url = `${PREFIX_URL}/cardSet/list`;
  let data = {
    id_list
  };
  return axios.post(url, qs.stringify(Object.assign(data, {'_sg': getSign(data)})))
    .then((res) => {
      return Promise.resolve(res)
    })
    .catch((error) => {
      return Promise.resolve({
        err_code: error.response.status,
        err_msg: error.response.status
      })
    })
}

export function card_list(id_list) {
  const url = `${PREFIX_URL}/card/list`;
  let data = {
    id_list
  };
  return axios.post(url, qs.stringify(Object.assign(data, {'_sg': getSign(data)})))
    .then((res) => {
      return Promise.resolve(res)
    })
    .catch((error) => {
      return Promise.resolve({
        err_code: error.response.status,
        err_msg: error.response.status
      })
    })
}
