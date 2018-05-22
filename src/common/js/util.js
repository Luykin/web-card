import md5 from 'js-md5'
import CryptoJS from 'crypto-js'
// const PRIVATE_KEY = decryptByDES('pm+VjW6uV5gFNGfZ83r1pw==','') + decryptByDES('2qhuliPfW8Y=','')

export function encryptByDES(message, key) {
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
export function decryptByDES(ciphertext, key) {
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

export function debounce(func, delay) {
  let timer

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
export function getKey() {
  const timestamp = parseInt(Date.parse(new Date()) / 10000)
  const key = md5(timestamp + decryptByDES('pm+VjW6uV5gFNGfZ83r1pw==', '') + decryptByDES('2qhuliPfW8Y=', ''))
  return key
}
export function getSign(data) {
  // const timestamp = parseInt(Date.parse(new Date()) / 10000)
  let sortedKeys = Object.keys(data).sort()
  let signStr = ''
  for (let item in sortedKeys) {
    const key = sortedKeys[item]
    signStr += key + '=' + data[key]
  }
  signStr += 'key=' + decryptByDES('pm+VjW6uV5gFNGfZ83r1pw==', '') + decryptByDES('2qhuliPfW8Y=', '')
  const sign = md5(signStr)
  return sign
}
export function testToken(tokenTime) {
  let nowTime = +new Date()
  let tokenTimeA = tokenTime || 0
  if (nowTime > tokenTime) {
    return false
  } else {
    return true
  }
}
export function timeChange(time) {
  let date = new Date(time * 1000)
  // const Y = date.getYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
  const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
  const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  return M + D + h + m
}
export function encryptedStorage(key, value) {
  let v = JSON.stringify(value)
  v = encryptByDES(v, '') || false
  localStorage.setItem(key, v)
}
