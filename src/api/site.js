import axios from 'axios'
import qs from 'qs'
import { PREFIX_URL, UAID } from './config'
import { getSign } from 'common/js/util'

export function getSiteinfo(token) {
  const url = `${PREFIX_URL}/site_info`
  let data = {
    token: token
  }
  return axios.get(url, {
    params: Object.assign({ sign: getSign(data) }, data)
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
export function setSiteinfo(token, icon, site_name, title_suffix, announcement, email, contact) {
  const url = `${PREFIX_URL}/set_sub_site`
  let data = {
    token: token,
    icon: icon,
    site_name: site_name,
    title_suffix: title_suffix,
    announcement: announcement,
    email: email,
    contact: contact
  }
  return axios.post(url, qs.stringify(Object.assign({ sign: getSign(data) }, data)))
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
export function getAgencyservice(token, status, service_category_id) {
  const url = `${PREFIX_URL}/agency_service`
  let data = {
    token: token
  }
  if (status) {
    data = Object.assign({ status: status }, data)
  }
  if (service_category_id) {
    data = Object.assign({ service_category_id: service_category_id }, data)
  }
  return axios.get(url, {
    params: Object.assign({ sign: getSign(data) }, data)
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
export function getPoundageConfig(id) {
  const url = `${PREFIX_URL}/config`
  let data = {
    uaid: UAID,
    k: 'poundage'
  }
  return axios.get(url, {
    params: Object.assign({ sign: getSign(data) }, data)
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
export function getWithdrawlist(token, num, page) {
  const url = `${PREFIX_URL}/withdraw_list`
  let data = {
    token: token,
    num: num,
    page: page
  }
  return axios.get(url, {
    params: Object.assign({ sign: getSign(data) }, data)
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
export function withdraw(token, money, account_id) {
  const url = `${PREFIX_URL}/withdraw`
  let data = {
    uaid: UAID,
    token: token,
    money: money,
    account_id: account_id
  }
  return axios.post(url, qs.stringify(Object.assign({ sign: getSign(data) }, data)))
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
export function setAgency(token, service_id, price, status) {
  const url = `${PREFIX_URL}/set_agency_service`
  let data = {
    token: token,
    service_id: service_id,
    price: price,
    status: status
  }
  return axios.post(url, qs.stringify(Object.assign({ sign: getSign(data) }, data)))
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
export function getAccount(token) {
  const url = `${PREFIX_URL}/withdraw_account`
  let data = {
    token: token
  }
  return axios.get(url, {
    params: Object.assign({ sign: getSign(data) }, data)
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
export function addAccount(token, account_type, account, name, code) {
  const url = `${PREFIX_URL}/add_withdraw_account`
  let data = {
    token: token,
    account_type: account_type,
    account: account,
    name: name,
    code: code
  }
  return axios.post(url, qs.stringify(Object.assign({ sign: getSign(data) }, data)))
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
export function getOrders(token, num, page, is_agency, code) {
  const url = `${PREFIX_URL}/orders`
  let data = {
    token: token,
    num: num,
    page: page,
    is_agency: is_agency
  }
  if (code) {
    data = Object.assign({ code: code }, data)
  }
  return axios.get(url, {
      params: Object.assign({ sign: getSign(data) }, data)
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
export function setDomain(token, sub_domain) {
  const url = `${PREFIX_URL}/set_sub_domain`
  let data = {
    token: token,
    sub_domain: sub_domain
  }
  return axios.post(url, qs.stringify(Object.assign({ sign: getSign(data) }, data)))
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
