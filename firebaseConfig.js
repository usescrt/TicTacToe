// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth/react-native";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTaauJjQj2ZVw1VMbPdq_oXyLSk5DiIOE",
  authDomain: "tictactoe-25faa.firebaseapp.com",
  projectId: "tictactoe-25faa",
  storageBucket: "tictactoe-25faa.appspot.com",
  messagingSenderId: "491630006604",
  appId: "1:491630006604:web:7554a71bdf73c125653fe9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore();

export { auth, firestore };
