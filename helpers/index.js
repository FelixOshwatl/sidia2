const crypto = require('crypto')
const sec = process.env.SIKD_SEC

const encrypt = function (text) {
  var mykey = crypto.createCipher('aes-128-cbc', sec);
  return mykey.update(text, 'utf8', 'hex') + mykey.final('hex');
}

const decrypt = function (text) {
  try {
    var mykey = crypto.createDecipher('aes-128-cbc', sec);
    text = mykey.update(text, 'hex', 'utf8') + mykey.final('utf8');
    //console.log(text)
    return text;
  } catch (ex) {
    //untuk menjaga session ketika diubah, akan diset menjadi kodeRole = 0
    const dataGoogle = {
      kodeUser: 0,
      namaUser: "",
      npk: "",
      kodeKantor: "",
      email: "",
      setRole: false,
      kodeRole: 0,
      namaRole: "",
      token: ""
    };

    var dataLogin = JSON.stringify(dataGoogle);
    return dataLogin;
  }
}

const kodeRole = {
  dev: '1990'
};

export default {
  encrypt,
  decrypt,
  kodeRole
}
