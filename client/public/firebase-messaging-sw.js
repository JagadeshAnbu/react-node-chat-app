console.log("Service Worker script started");

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

console.log("Firebase scripts imported successfully");

const firebaseConfig = {
    apiKey: "AIzaSyB51vzcpnm4hB_5TUGp0OAYUxvStioqpAY",
    authDomain: "conprg-chat-app.firebaseapp.com",
    projectId: "conprg-chat-app",
    storageBucket: "conprg-chat-app.appspot.com",
    messagingSenderId: "537419541738",
    appId: "1:537419541738:web:04bf724d0a9895e4347b93",
    measurementId: "G-GW7YXSDJFS"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Received background message: ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});