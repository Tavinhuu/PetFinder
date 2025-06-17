import { db, auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    carregarFormulario();
  }
});


function carregarFormulario() {
  const app = document.getElementById('app');

  app.innerHTML = `
  <div class="form-container">
    <img src="../images/logo.png" alt="PetFinder Logo" />
    <p class="subtitle">Realize o cadastro do seu pet desaparecido!</p>
    <form id="petForm">
      <input type="text" placeholder="Nome do pet" id="nome" required />
      <input type="text" placeholder="Espécie / Raça" id="raca" required />
      <input type="text" placeholder="Local do desaparecimento" id="local" required />
      <input type="date" id="data" required />
      <input type="tel" placeholder="Telefone de contato" id="telefone" required />
      <input type="text" placeholder="URL da imagem do pet" id="imagem" />
      <button type="submit" class="button">Cadastrar</button>
    </form>
    <p id="mensagem" class="status-message"></p>
    <a href="my-pets.html" class="back-link">← Voltar</a>
  </div>
`;


  const form = document.getElementById('petForm');
  const mensagem = document.getElementById('mensagem');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const raca = document.getElementById('raca').value;
    const local = document.getElementById('local').value;
    const data = document.getElementById('data').value;
    const telefone = document.getElementById('telefone').value;
    const imagem = document.getElementById('imagem').value;

    try {
      await addDoc(collection(db, 'petsPerdidos'), {
        nome,
        raca,
        local,
        data,
        telefone,
        imagem,
        status: 'perdido',
        criadoEm: new Date(),
        usuarioId: auth.currentUser.uid
      });
      mensagem.textContent = '✅ Pet cadastrado com sucesso!';
      form.reset();
    } catch (err) {
      console.error('Erro ao cadastrar pet:', err);
      mensagem.textContent = '❌ Erro ao cadastrar pet.';
    }
  });
}



document.getElementById('btnLogout').addEventListener('click', async () => {
  try {
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Erro ao sair:', err);
    alert('Erro ao fazer logout.');
  }
});

onAuthStateChanged(auth, (user) => {
  const authControl = document.getElementById('authControl');
  const myPetsLink = document.getElementById('myPetsLink');

  if (user) {
    if (authControl) {
      authControl.innerHTML = `<a id="btnLogout" class="button">Sair</a>`;
      document.getElementById('btnLogout').addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = 'login.html';
      });
    }

    if (myPetsLink) {
      myPetsLink.style.display = 'list-item';
    }
  } else {
    if (authControl) {
      authControl.innerHTML = `<a href="login.html" class="button">Login</a>`;
    }

    if (myPetsLink) {
      myPetsLink.style.display = 'none';
    }
  }
});