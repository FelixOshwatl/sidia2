/*
Give the service worker access to Firebase Messaging.
Note that you can only use Firebase Messaging here, other Firebase libraries are not available in the service worker.
*/
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

/*
Initialize the Firebase app in the service worker by passing in the messagingSenderId.
*/
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

/*
Retrieve an instance of Firebase Messaging so that it can handle background messages.
*/
self.addEventListener('notificationclick', function(event) {
    console.log(event.notification?.data?.FCM_MSG);
    let url = event.notification?.data?.FCM_MSG?.notification?.click_action
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notification = JSON.parse(payload.data.notification);
    // Customize notification here
    const notificationTitle = notification.title;
    const notificationOptions = {
        body: notification.body,
        icon: notification.icon,
        data: { url:notification.click_action }, 
        actions: [{action: "open_url", title: "Read Now"}]
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});