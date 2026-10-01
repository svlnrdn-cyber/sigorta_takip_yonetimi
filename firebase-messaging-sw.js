importScripts(
    "https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyC5xDRadJtlS7lcE8J5h7l6zf2JLvz3QMk",
    authDomain: "sigorta-takip-merkezi.firebaseapp.com",
    projectId: "sigorta-takip-merkezi",
    storageBucket: "sigorta-takip-merkezi.firebasestorage.app",
    messagingSenderId: "401508358707",
    appId: "1:401508358707:web:7dc258d61013d8a9e92146"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle =
        payload.notification && payload.notification.title
            ? payload.notification.title
            : "Sigorta Takip Merkezi";

    const notificationBody =
        payload.notification && payload.notification.body
            ? payload.notification.body
            : "Yeni bir bildiriminiz var.";

    const notificationUrl =
        payload.fcmOptions && payload.fcmOptions.link
            ? payload.fcmOptions.link
            : self.registration.scope;

    self.registration.showNotification(
        notificationTitle,
        {
            body: notificationBody,
            data: {
                url: notificationUrl
            }
        }
    );
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const hedef =
        event.notification &&
        event.notification.data &&
        event.notification.data.url
            ? event.notification.data.url
            : self.registration.scope;

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then(function (clientList) {
            for (const client of clientList) {
                if (
                    client.url.startsWith(self.registration.scope) &&
                    "focus" in client
                ) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(hedef);
            }

            return undefined;
        })
    );
});