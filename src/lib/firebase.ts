import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwifKwY-Tjg7j_U-F2RhOZ48kL7X0zZBQ",
    authDomain: "snyderai.firebaseapp.com",
    projectId: "snyderai",
    storageBucket: "snyderai.firebasestorage.app",
    messagingSenderId: "188154681692",
    appId: "1:188154681692:web:9ba75cdbcbbb93ab5a8999",
    measurementId: "G-SP5PP955T0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
