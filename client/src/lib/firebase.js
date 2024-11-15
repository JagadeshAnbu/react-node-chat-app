import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyB51vzcpnm4hB_5TUGp0OAYUxvStioqpAY",
    authDomain: "conprg-chat-app.firebaseapp.com",
    projectId: "conprg-chat-app",
    storageBucket: "conprg-chat-app.appspot.com",
    messagingSenderId: "537419541738",
    appId: "1:537419541738:web:04bf724d0a9895e4347b93",
    measurementId: "G-GW7YXSDJFS"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications');
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            throw new Error('Notification permission denied');
        }

        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker is not supported');
        }
        
        // Register service worker with correct scope
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
        });

        const vapidKey = "BHkhO8JZBLjtFJYD-0eEflg8wCB8_z-qCBYpkH0TyMFjdpBSioYcBQyxL1Apkr7DBLe-7lACmQL0K4iIFezpNZU";
        
        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration
        });

        if (!token) {
            throw new Error('Failed to retrieve FCM token');
        }

        console.log('FCM Token:', token);
        return token;
    } catch (error) {
        console.error("Failed to get notification permission or token:", error);
        throw error;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("Foreground message received:", payload);
            resolve(payload);
        });
    });