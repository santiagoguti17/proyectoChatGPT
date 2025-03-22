// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXztjxBDrGhzJS5N3ni4NKWvZQs3iT4KA",
  authDomain: "chatgpt-6d718.firebaseapp.com",
  projectId: "chatgpt-6d718",
  storageBucket: "chatgpt-6d718.firebasestorage.app",
  messagingSenderId: "483680142555",
  appId: "1:483680142555:web:97b78efe86d7ce588078fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth(app);


export { db };
export default app;