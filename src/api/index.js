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

export function card_id(card_id, user_id) {
  const url = `${PREFIX_URL}/card/card_id`;
  let data = {
    card_id,
  };
  if (user_id) {
    Object.assign(data, {
      user_id
    })
  }
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

//collection 收藏

export function collection(user_id, card_id, collection) {
  const url = `${PREFIX_URL}/card/collection`;
  let data = {
    card_id,
    user_id,
    collection
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

//collection 收藏列表
export function collection_list(user_id) {
  const url = `${PREFIX_URL}/card/collection_list`;
  let data = {
    user_id
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

//access_token
export function access_token(code, redirect_uri) {
  // const url = `https://graph.qq.com/oauth2.0/token`;
  const url = `${PREFIX_URL}/login/access_token`;
  let data = {
    grant_type: 'authorization_code',
    client_id: '101542054',
    client_secret: 'e09ca0bd128ab639227ba6093d7c4c99',
    code,
    redirect_uri
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

// app_info
export function app_info(app_id = 1) {
  const url = `${PREFIX_URL}/other/app_info`;
  let data = {
    app_id,
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

// course_type_list
export function course_type_list(show_list = 'all') {
  const url = `${PREFIX_URL}/other/course_type_list`;
  let data = {
    show_list,
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

// course_list
export function course_list(course_type_id='all') {
  const url = `${PREFIX_URL}/other/course_list`;
  let data = {
    course_type_id
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


// user_info
export function user_info(id) {
  const url = `${PREFIX_URL}/login/user_info`;
  let data = {
    id,
    _tm: +new Date()
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
