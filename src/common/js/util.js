import md5 from 'js-md5'
const PRIVATE_KEY = 'FansMelonBlock2017'

export function normalOrders (list) {
  let ret = list
  if (ret.length < 10) {
    for (let i = 0; i < 4; i++) {
      ret = ret.concat(ret)
      if (ret.length >= 10) {
        break
      }
    }
  }
  if (ret.length >= 10) {
    ret = ret.slice(0, 10)
  }
  ret.push(ret[0])
  return ret
}
export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
export function getKey () {
  const timestamp = parseInt(Date.parse(new Date()) / 10000) + ''
  const key = md5(timestamp + PRIVATE_KEY)
  return key
}
