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

export function good_list() {
  const url = `${PREFIX_URL}/goods/list`;
  let data = {};
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

export function send_message(phone) {
  const url = `${PREFIX_URL}/login/messages`;
  let data = {
    phone
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

export function register(phone, code) {
  const url = `${PREFIX_URL}/login/register`;
  let data = {
    phone,
    code
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
export function code_login(phone, code) {
  const url = `${PREFIX_URL}/login/code`;
  let data = {
    phone,
    code
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

// card_id

export function card_id(card_id) {
  const url = `${PREFIX_URL}/card/card_id`;
  let data = {
    card_id,
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
