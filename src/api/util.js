const CryptoJS = require('./CryptoJS.js');
const PRIVATE_KEY = '71cda2383f6835re8a39d1v8e6ba8a9n';
export const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n
};

export const getTime = () => {
    return Date.parse(new Date());
};

export const getSign = (data) => {
    let sortedKeys = Object.keys(data).sort();
    let signStr = '';
    for (let item in sortedKeys) {
        const key = sortedKeys[item];
        signStr += key + '=' + data[key] + '&'
    }
    signStr += 'key=' + PRIVATE_KEY;
    return CryptoJS.MD5(signStr).toString().toUpperCase();
};

const verifyPhone = (phone) => {
    if (!phone) {
        return false
    }
    let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
    return myreg.test(phone)
};
