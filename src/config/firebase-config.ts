import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBnU5RMH4Y9k431QeQGkRhMAtsPfSaQx6E",
    authDomain: "simple-store-fbe1f.firebaseapp.com",
    projectId: "simple-store-fbe1f",
    storageBucket: "simple-store-fbe1f.appspot.com",
    messagingSenderId: "1039012474786",
    appId: "1:1039012474786:web:a96f9b923c60ae299b0cfb"
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);
export default fireApp;