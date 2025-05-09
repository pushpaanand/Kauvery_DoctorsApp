import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCHno8T03yciVtzFATqNgiwxzKI3NE-Qro",
  authDomain: "doctors-app-e315f.firebaseapp.com",
  projectId: "doctors-app-e315f",
  storageBucket: "doctors-app-e315f.firebasestorage.app",
  messagingSenderId: "726305497036",
  appId: "1:726305497036:web:85035a08fb0c2742558769",
  measurementId: "G-VHZYY1648K"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);