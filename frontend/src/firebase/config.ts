import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2TCZ5-0ZkCipGzl9PjoOHSH9MpKnfbvM",
  authDomain: "foodordering-86735.firebaseapp.com",
  projectId: "foodordering-86735",
  storageBucket: "foodordering-86735.appspot.com",
  messagingSenderId: "367361837017",
  appId: "1:367361837017:web:b6cb84900d23f7babafbc8",
  measurementId: "G-92GGS7YXFM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export default app;
