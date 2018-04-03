import axios from 'axios'
import qs from 'qs'
import { PREFIX_URL, UAID } from './config'
import { getKey } from 'common/js/util'

export function sendVerify(phone) {
  const url = `${PREFIX_URL}/send_verify`
  return axios.post(url, qs.stringify({
    phone: phone,
    uaid: UAID,
    key: getKey()
  })).then(function(res) {
    return Promise.resolve(res)
  })
}
export function login(phone, password) {
  const url = `${PREFIX_URL}/login`
  return axios.post(url, qs.stringify({
    phone: phone,
    password: password,
    uaid: UAID,
    key: getKey()
  })).then(function(res) {
    return Promise.resolve(res)
  })
}
export function register(phone, password, repassword, code) {
  const url = `${PREFIX_URL}/register`
  return axios.post(url, qs.stringify({
    phone: phone,
    password: password,
    re_password: repassword,
    code: code,
    uaid: UAID,
    key: getKey()
  })).then(function(res) {
    return Promise.resolve(res)
  })
}
export function findPassword(phone, password, repassword, code) {
  const url = `${PREFIX_URL}/find_password`
  return axios.post(url, qs.stringify({
    phone: phone,
    new_password: password,
    re_new_password: repassword,
    code: code,
    uaid: UAID,
    key: getKey()
  })).then(function(res) {
    return Promise.resolve(res)
  })
}
export function updatePassword(password, newpassword, renewpassword, token) {
  const url = `${PREFIX_URL}/update_password`
  return axios.post(url, qs.stringify({
    password: password,
    new_password: newpassword,
    re_new_password: renewpassword,
    token: token,
    key: getKey()
  })).then(function(res) {
    return Promise.resolve(res)
  })
}
