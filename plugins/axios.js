const crypto = require('crypto')
const sec = process.env.SIKD_SEC

function encrypt(text) {
    if (!text) return '';
    try {
        var mykey = crypto.createCipher('aes-128-cbc', sec);
        return mykey.update(text, 'utf8', 'hex') + mykey.final('hex');
    } catch (ex) {
        console.log(ex);
        return '';
    }
}

function decrypt(text) {
    if (!text) return '';
    try {
        var mykey = crypto.createDecipher('aes-128-cbc', sec);
        return mykey.update(text, 'hex', 'utf8') + mykey.final('utf8');
    } catch (ex) {
        console.log(ex);
        return '';
    }
}

//https://axios.nuxtjs.org/helpers
export default function ({ app, $axios, redirect }) {
    $axios.onRequest(config => {
        config.headers['Content-Type'] = 'application/json' 
        const token = localStorage.getItem('authToken')
        if (token) {
            if(token.includes('Bearer')) {
                config.headers['Authorization'] = token
            } else {
                config.headers['Authorization'] = 'Bearer ' + token
            }
        } else {
            config.headers['Authorization'] =  null
        }

        const method = config.method.toLowerCase()
        if ( method=='put' || method=='patch' || method=='delete' ) {
          config.headers.common['X-HTTP-Method-Override'] = config.method 
          config.headers.post['X-HTTP-Method-Override'] = config.method 
          config.method = 'post'
        }

        if(config.params) {
            const encryptedParams = encrypt(JSON.stringify(config.params))
            config.params =  { qq: encryptedParams }    
        }

        if(config.data) {
            const encryptedData = encrypt(JSON.stringify(config.data))
            config.data =  { data: encryptedData }    
        }
    })

    $axios.onResponse(response => {
        if(response && response.data && response.data.data) {
            const decryptedData = decrypt(response.data.data)
            response.data = JSON.parse(decryptedData)   
        }
    })

    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if (code === 401) {
            redirect('/login')
            app.$swal("Unauthorized", "Sesi habis. Silahkan login kembali!", "error")
            $axios.setHeader('Authorization', null)
            app.$axios.setHeader('Authorization', null)
            sessionStorage.clear()
            localStorage.clear()
        }
        console.log(error)
        //additional sentry capture
        //app.$sentry.captureException(error)
    })

}