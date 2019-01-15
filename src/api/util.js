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

// //aes加密
// export function encrypt(word, key_word='5634567895007501') {
//   const key = CryptoJS.enc.Utf8.parse(key_word); //16位
//   const iv = CryptoJS.enc.Utf8.parse(key_word);
//   let encrypted = '';
//   if (typeof(word) === 'string') {
//     const srcs = CryptoJS.enc.Utf8.parse(word);
//     encrypted = CryptoJS.AES.encrypt(srcs, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7
//     });
//   } else if (typeof(word) === 'object') {//对象格式的转成json字符串
//     const srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(word));
//     encrypted = CryptoJS.AES.encrypt(srcs, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7
//     })
//   }
//   return encrypted.ciphertext.toString();
// }
//
// // aes解密
// export function decrypt(word, key_word='5634567895007501') {
//   const key = CryptoJS.enc.Utf8.parse(key_word);
//   const iv = CryptoJS.enc.Utf8.parse(key_word);
//   const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
//   const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
//   const decrypt = CryptoJS.AES.decrypt(srcs, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7
//   });
//   const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
//   return decryptedStr.toString();
// }
