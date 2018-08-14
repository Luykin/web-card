'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modifyEnv = modifyEnv;
var PREFIX_URL = exports.PREFIX_URL = 'https://qzone.melonblock.com/fans';
var UAID = exports.UAID = 60006;
var QINIU_PREFIX = exports.QINIU_PREFIX = '-xingkong'; //七牛云储存前缀，防误删
var SUCCESS_CODE = exports.SUCCESS_CODE = 200;
var TRADE_TYPE = exports.TRADE_TYPE = 'MWEB'; // h5交易类型
function modifyEnv() {
  exports.PREFIX_URL = PREFIX_URL = 'https://dev.melonblock.com/fans';
}