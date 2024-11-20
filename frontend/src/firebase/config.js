
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider} from 'firebase/auth'
import { getAuth } from 'firebase/auth'

import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCGcFgCmpLmkJJgW65RBz2fX2S-EpSsgiw",
    authDomain: "toolbear-58c74.firebaseapp.com",
    projectId: "toolbear-58c74",
    storageBucket: "toolbear-58c74.firebasestorage.app",
    messagingSenderId: "245871246870",
    appId: "1:245871246870:web:c300ddc542474da2a3ff37",
    measurementId: "G-RTS5XM5P67"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage
export { auth,db ,storage};
export const googleProvider = new GoogleAuthProvider()