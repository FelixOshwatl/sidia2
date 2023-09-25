
const crypto = require('crypto')
const sec = process.env.SIKD_SEC

import Vue from 'vue';

Vue.prototype.$encrypt = function (text) {
  var mykey = crypto.createCipher('aes-128-cbc', sec);
  return mykey.update(text, 'utf8', 'hex') + mykey.final('hex');
}

Vue.prototype.$decrypt = function (text) {
  try {
    var mykey = crypto.createDecipher('aes-128-cbc', sec);
    text = mykey.update(text, 'hex', 'utf8') + mykey.final('utf8');
    return text;
  } catch (ex) {
    console.log(ex)
    return '';
  }
}