import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy39tUW9qZRtm1pM5fgnQoSMJLHKu_Qj4",
  authDomain: "client-vendor-21dd8.firebaseapp.com",
  databaseURL: "https://client-vendor-21dd8-default-rtdb.firebaseio.com",
  projectId: "client-vendor-21dd8",
  storageBucket: "client-vendor-21dd8.appspot.com",
  messagingSenderId: "567157449354",
  appId: "1:567157449354:web:465f1f0633bb05d5e84373",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const storage = getStorage();

export const db = getFirestore(app);

export default storage;
