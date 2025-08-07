// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3f_uMYlBAesZeoQok2EpFTnZlHNVYc6s",
  authDomain: "ar-plan-identifier.firebaseapp.com",
  projectId: "ar-plan-identifier",
  storageBucket: "ar-plan-identifier.firebasestorage.app",
  messagingSenderId: "332969816462",
  appId: "1:332969816462:web:dca2b69be8b4eff74834df",
  measurementId: "G-V5L7SYE51Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);