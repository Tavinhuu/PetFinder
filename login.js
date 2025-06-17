import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const email = document.getElementById('email');
const senha = document.getElementById('senha');
const status = document.getElementById('status');

document.getElementById('btnLogin').addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email.value, senha.value);
    window.location.href = 'homepage.html';
  } catch (err) {
    status.textContent = '❌ Erro no login: ' + err.message;
  }
});

document.getElementById('btnCadastro').addEventListener('click', async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, senha.value);
    status.textContent = '✅ Conta criada com sucesso!';
  } catch (err) {
    status.textContent = '❌ Erro no cadastro: ';
  }
});
