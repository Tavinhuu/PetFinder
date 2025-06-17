import { db, auth } from './firebase-config.js';
import {
  doc,
  getDoc,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const petId = params.get('id');
const container = document.getElementById('petDetails');

if (!petId) {
  container.innerHTML = '<p>ID inválido.</p>';
  throw new Error('ID não fornecido');
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const petRef = doc(db, 'petsPerdidos', petId);
    const petSnap = await getDoc(petRef);

    if (!petSnap.exists()) {
      container.innerHTML = '<p>Pet não encontrado.</p>';
      return;
    }

    const pet = petSnap.data();

    container.innerHTML = `
      <div class="pet-details-container">
        <img src="${pet.imagem || '../images/no-image.png'}" class="pet-image" alt="${pet.nome}" />
        <div class="pet-info">
          <h2>${pet.nome}</h2>
          
          <p><strong>Espécie:</strong> ${pet.raca}</p>
          <p><strong>Localização:</strong> ${pet.local}</p>
          <p><strong>Data de desaparecimento:</strong> ${pet.data}</p>
          <p><strong>Telefone para contato:</strong> ${pet.telefone}</p>
          <br>
          <p class="highlight-button"><span class="${pet.status === 'perdido' ? 'lost' : 'found'}">${pet.status}</span></p>
        </div>
      </div>

      <div class="contact-box">
        <h3>Encontrou este pet?</h3>
        <form id="foundForm">
          <textarea id="message" placeholder="Escreva uma mensagem!" required></textarea>
          <center>
          <button style="background-color: #AF03C6; border-radius: 37px" type="submit">Enviar</button></center>
        </form>
        <p id="statusMsg"></p>
      </div>
    `;

    const form = document.getElementById('foundForm');
    const statusMsg = document.getElementById('statusMsg');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = document.getElementById('message').value;

      try {
        await addDoc(collection(db, 'petMessages'), {
          petId,
          toUser: pet.usuarioId,
          fromUser: user.uid,
          fromEmail: user.email,
          message,
          createdAt: new Date()
        });
        statusMsg.textContent = '✅ Mensagem enviada!';
        form.reset();
      } catch (err) {
        console.error(err);
        statusMsg.textContent = '❌ Erro ao enviar mensagem.';
      }
    });

  } catch (err) {
    console.error('Erro ao carregar os detalhes deste pet:', err);
    container.innerHTML = '<p>Opps,. algo deu errado.</p>';
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
