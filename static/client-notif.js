        const firebaseConfig = {
            apiKey: "AIzaSyBYnS7uH4IfxA6PnewiNOlRTy4-0MfnLPs",
            authDomain: "push-notif-dfe3f.firebaseapp.com",
            projectId: "push-notif-dfe3f",
            storageBucket: "push-notif-dfe3f.appspot.com",
            messagingSenderId: "168314300812",
            appId: "1:168314300812:web:05a8d74abf194d6b48cea9",
            measurementId: "G-HYCS7J38JW"
        };

        firebase.initializeApp(firebaseConfig);

        const messaging = firebase.messaging();
        function initFirebaseMessagingRegistration(apiUrl) {
            messaging
                .requestPermission()
                .then(function () {
                    console.log("Got notification permission");
                    return messaging.getToken();
                })
                .then(function (token) {
                    // print the token on the HTML page
                    console.log(apiUrl)
                    console.log("Token is " + token);
                    let user = JSON.parse(atob(sessionStorage.getItem('authToken').split('.')[1]));
                    fetch(apiUrl+'/naskah/updateDeviceByLogin', {
                        method: 'post',
                        headers: {
                        'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            npk: user.npk,
                            token: token,
                            petugas: user.username
                            //p256dh: 'xxxx',
                            //auth: 'xxxxx'
                        })
                    }); 

                    //save db
                })
                .catch(function (err) {
                    console.log("Didn't get notification permission", err);

                    Notification.requestPermission(function () {
                        if (Notification.permission === 'granted') {
                            // user approved.
                            // use of new Notification(...) syntax will now be successful
                            console.log('accept')
                            //save to db    
                            // initFirebaseMessagingRegistration();
                        } else if (Notification.permission === 'denied') {
                            // user denied.
                            console.log('denied')
                        } else { 
                            console.log('no action')
                            // Notification.permission === 'default'
                            // user didn’t make a decision.
                            // You can’t send notifications until they grant permission.
                        }
                    });

                });
        }

        messaging.onMessage(function (payload) {
            console.log("Message received. ", JSON.stringify(payload));
            // notificationElement.innerHTML = notificationElement.innerHTML + " " + payload.notification;
        });
        messaging.onTokenRefresh(function () {
            messaging.getToken()
                .then(function (refreshedToken) {
                    console.log('Token refreshed.');
                    console.log(refreshedToken)
                    // tokenElement.innerHTML = "Token is " + refreshedToken;
                }).catch(function (err) {
                    // errorElement.innerHTML = "Error: " + err;
                    console.log('Unable to retrieve refreshed token ', err);
                });
        });