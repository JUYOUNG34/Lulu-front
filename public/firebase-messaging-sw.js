importScripts("https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js");

// Firebase 앱 초기화
firebase.initializeApp({
    apiKey: "AIzaSyChLyBAVAUGeBHyn1CKDTJfq4ekHtGSy28",
    authDomain: "lulufriends-b5ee4.firebaseapp.com",
    projectId: "lulufriends-b5ee4",
    storageBucket: "lulufriends-b5ee4.firebasestorage.app",
    messagingSenderId: "141428953928",
    appId: "1:141428953928:web:ba16cd09f662f83c4cd97d",
    measurementId: "G-CT10MPMWBZ"
});

// 메시징 객체 초기화
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const type = payload.data?.type;

    if (type === "FETCH_ROOMS") {
        // React 앱으로 메시지 전달
        self.clients.matchAll({ includeUncontrolled: true, type: "window" }).then((clients) => {
            clients.forEach((client) => {
                client.postMessage({
                    type: "FETCH_ROOMS",
                    data: payload.data,
                });
            });
        });

        return;
    }

    const title = payload.data?.title;
    const options = {
        body: payload.data?.body,
        icon: payload.data?.icon,
        data: payload.data,
    };
    self.registration.showNotification(title, options);
});
