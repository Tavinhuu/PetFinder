// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCfHEIDimS6sMNYW8uGUGvhpBdd4awjqMQ",
  authDomain: "petfinder-78c94.firebaseapp.com",
  projectId: "petfinder-78c94",
  storageBucket: "petfinder-78c94.appspot.com", 
  messagingSenderId: "271253942830",
  appId: "1:271253942830:web:814a4fe657d2b8a9c425bf",
  measurementId: "G-9BD9LSGSM5"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta instâncias
export const db = getFirestore(app);
export const auth = getAuth(app);
