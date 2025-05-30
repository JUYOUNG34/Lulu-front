// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyChLyBAVAUGeBHyn1CKDTJfq4ekHtGSy28",
    authDomain: "lulufriends-b5ee4.firebaseapp.com",
    projectId: "lulufriends-b5ee4",
    storageBucket: "lulufriends-b5ee4.firebasestorage.app",
    messagingSenderId: "141428953928",
    appId: "1:141428953928:web:ba16cd09f662f83c4cd97d",
    measurementId: "G-CT10MPMWBZ",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// (선택) Analytics 사용
let analytics = null;
try {
    analytics = getAnalytics(app);
} catch (error) {
    console.warn("Analytics not supported:", error);
}

// Firebase Cloud Messaging 안전하게 초기화
let messaging = null;

// Messaging 지원 여부 확인 후 초기화
const initializeMessaging = async () => {
    try {
        const supported = await isSupported();
        if (supported && 'serviceWorker' in navigator) {
            messaging = getMessaging(app);
        } else {
            console.warn("Firebase Messaging is not supported in this browser");
        }
    } catch (error) {
        console.warn("Firebase Messaging initialization failed:", error);
    }
};

// 안전한 메시지 리스너
export const listenToMessages = (callback) => {
    if (!messaging) {
        console.warn("Firebase Messaging is not initialized");
        return;
    }
    
    try {
        onMessage(messaging, (payload) => {
            callback(payload);
        });
    } catch (error) {
        console.warn("Failed to listen to messages:", error);
    }
};

// 초기화 실행
initializeMessaging();

// 필요한 경우 app, messaging, analytics를 export
export { app, messaging, analytics };
