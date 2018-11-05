import axios from 'axios'
import qs from 'qs'
import {
  PREFIX_URL,
  UAID
} from './config'
import {
  getSign,
  isPhone,
  isWx
} from 'common/js/util'

export function getServiceCategory() {
  const url = `${PREFIX_URL}/service_category`
  let data = {
    uaid: UAID
  }
  return axios.get(url, {
    params: Object.assign({
      sign: getSign(data)
    }, data)
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
export function getServices(id, sub_domain) {
  const url = `${PREFIX_URL}/services`
  let data = {
    uaid: UAID,
    service_category_id: id
  }
  if (sub_domain) {
    data = Object.assign({
      sub_domain: sub_domain
    }, data)
  }
  return axios.get(url, {
    params: Object.assign({
      sign: getSign(data)
    }, data)
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
export function getFanProject() {
  const url = `${PREFIX_URL}/fan_project`
  let data = {
    is_fan_project: 1
  }
  return axios.get(url, {
    params: Object.assign({
      sign: getSign(data)
    }, data)
  }).then(function(res) {
    return Promise.resolve(res)
  }).catch(function(error) {
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
//2018.08.28 网红方案下单
// point, service_id, uaid, price, addition, sub_domain, pay_type, target_id, appointment_time
export function addFanProject(token, buydata) {
  const url = `${PREFIX_URL}/add_fan_project`
  let data = {
    token: token,
    fan_project_id: buydata.fan_project_id,
    uaid: UAID,
    price: buydata.price,
    addition: buydata.addition,
    pay_type: buydata.pay_type,
  }
  // Object.assign(data, {
  //   device: 'wx'
  // })
  if (isPhone() && !isWx()) {
    data = Object.assign({
      device: 'phone'
    }, data)
  } else {
    if (isWx()) {
      data = Object.assign({
        device: 'wx'
      }, data)
    } else {
      data = Object.assign({
        device: 'pc'
      }, data)
    }
  }
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
    .then(function(res) {
      return Promise.resolve(res)
    }).catch(function(error) {
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
export function addAgencyFanProject(token, price, fan_project_id, addition) {
  const url = `${PREFIX_URL}/agency_add_fan_project`
  let data = {
    token: token,
    fan_project_id: fan_project_id,
    uaid: UAID,
    price: price,
    addition: addition
  }
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
    .then(function(res) {
      return Promise.resolve(res)
    }).catch(function(error) {
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


export function getAppInfo() {
  const url = `${PREFIX_URL}/app_info`
  let data = {
    uaid: UAID
  }
  return axios.get(url, {
    params: Object.assign({
      sign: getSign(data)
    }, data)
  }).then(function(res) {
    return Promise.resolve(res)
  })
}
export function addTask(score, point, token, serviceid, addition, targetid, sublimeTime, comment) {
  const url = `${PREFIX_URL}/add_task`
  let data = {
    score: score,
    point: point,
    token: token,
    service_id: serviceid,
    uaid: UAID,
    addition: addition
  }
  if (targetid) {
    data = Object.assign({
      target_id: targetid
    }, data)
  }
  if (sublimeTime) {
    data = Object.assign({
      appointment_time: sublimeTime
    }, data)
  }
  if (comment) {
    data = Object.assign({
      comment: comment
    }, data)
  }
  console.log(data)
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
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
export function getUserInfo(token) {
  const url = `${PREFIX_URL}/user_info`
  let data = {
    token: token
  }
  return axios.get(url, {
      params: Object.assign({
        sign: getSign(data)
      }, data)
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
export function getShuoshuoList(qq, token) {
  const url = `${PREFIX_URL}/get_shuoshuo_list`
  let data = {
    qq: qq,
    token: token
  }
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
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
export function getsubsite(sub_domain) {
  const url = `${PREFIX_URL}/sub_site`
  let data = {
    uaid: UAID,
    sub_domain: sub_domain
  }
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
    .then(function(res) {
      return Promise.resolve(res)
    }).catch(function(error) {
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
export function latestTasks() {
  const url = `${PREFIX_URL}/latest_tasks`
  let data = {
    page: 0,
    num: 10,
  }
  return axios.get(url, {
    params: Object.assign({
      sign: getSign(data)
    }, data)
  }).then(function(res) {
    return Promise.resolve(res)
  }).catch(function(error) {
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
//2018.05.23 分站下单
// point, service_id, uaid, price, addition, sub_domain, pay_type, target_id, appointment_time
export function addSubSiteTask(token, buydata) {
  const url = `${PREFIX_URL}/add_sub_site_task`
  let data = {
    token: token,
    point: buydata.point,
    service_id: buydata.service_id,
    uaid: UAID,
    price: buydata.price,
    addition: buydata.addition,
    sub_domain: buydata.sub_domain,
    pay_type: buydata.pay_type

  }
  if (buydata.target_id) {
    data = Object.assign({
      target_id: buydata.target_id
    }, data)
  }
  if (buydata.appointment_time) {
    data = Object.assign({
      appointment_time: buydata.appointment_time
    }, data)
  }
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
    .then(function(res) {
      return Promise.resolve(res)
    }).catch(function(error) {
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
//合并下单
export function addSiteTask(token, buydata) {
  const url = `${PREFIX_URL}/add_site_task`
  let data = {
    token: token,
    point: buydata.point,
    service_id: buydata.service_id,
    uaid: UAID,
    price: buydata.price,
    addition: buydata.addition,
    pay_type: buydata.pay_type
  }
  if (buydata.sub_domain) {
    data = Object.assign({
      sub_domain: buydata.sub_domain
    }, data)
  }
  if (buydata.target_id) {
    data = Object.assign({
      target_id: buydata.target_id
    }, data)
  }
  if (buydata.appointment_time) {
    data = Object.assign({
      appointment_time: buydata.appointment_time
    }, data)
  }
  if (buydata.service_type) {
    data = Object.assign({
      service_type: buydata.service_type
    }, data)
  }
  if (buydata.comment) {
    data = Object.assign({
      comment: buydata.comment
    }, data)
  }
  // Object.assign(data, {
  //   device: 'wx'
  // })
  if (isPhone() && !isWx()) {
    data = Object.assign({
      device: 'phone'
    }, data)
  } else {
    if (isWx()) {
      data = Object.assign({
        device: 'wx'
      }, data)
    } else {
      data = Object.assign({
        device: 'pc'
      }, data)
    }
  }
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
    .then(function(res) {
      return Promise.resolve(res)
    }).catch(function(error) {
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
//20180815 增加套餐
export function getCombosCategory() {
  const url = `${PREFIX_URL}/combos_category`
  let data = {
    uaid: UAID
  }
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
    .then(function(res) {
      return Promise.resolve(res)
    }).catch(function(error) {
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
export function getCombos(categoryid) {
  const url = `${PREFIX_URL}/combos`
  let data = {
    category_id: categoryid,
    uaid: UAID
  }
  return axios.post(url, qs.stringify(Object.assign({
      sign: getSign(data)
    }, data)))
    .then(function(res) {
      return Promise.resolve(res)
    }).catch(function(error) {
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