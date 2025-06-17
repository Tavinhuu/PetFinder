import { db, auth } from './firebase-config.js';
import { deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const container = document.getElementById('messages');
const authControl = document.getElementById('authControl');
const myPetsLink = document.getElementById('myPetsLink');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  if (authControl) {
    authControl.innerHTML = `<a id="btnLogout" class="navbar-a">Sair</a>`;
    document.getElementById('btnLogout').addEventListener('click', async () => {
      await signOut(auth);
      window.location.href = 'login.html';
    });
  }

  if (myPetsLink) {
    myPetsLink.style.display = 'list-item';
  }

  try {
    const q = query(collection(db, 'petMessages'), where('toUser', '==', user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = '<p>Você não tem mensagens novas!.</p>';
      return;
    }

    let html = '<ul>';

    for (const messageDoc of snapshot.docs) {
      const data = messageDoc.data();

      let petInfo = '';
      if (data.petId) {
        const petRef = doc(db, 'petsPerdidos', data.petId);
        const petSnap = await getDoc(petRef);
        if (petSnap.exists()) {
          const pet = petSnap.data();
          petInfo = `<strong>Pet:</strong> ${pet.nome} (${pet.raca})<br>`;
        }
      }

      html += `
        <li>
          ${petInfo}
          <strong>Você recebeu uma nova mensagem!</strong><br>
          "${data.message}"<br>
          <small>De: ${data.fromEmail || data.fromUser}</small><br>

          <form class="replyForm" data-pet="${data.petId}" data-to="${data.fromUser}">
            <textarea placeholder="Escreva uma resposta!" required></textarea>
            <center>
            <button type="submit" style="background-color: #AF03C6; border-radius: 37px">Enviar</button>
            </center>
          </form>

          <a href="#" class="back-link delete-message" data-id="${messageDoc.id}">Deletar mensagem</a>
        </li>
      `;
    }

    html += '</ul>';
    container.innerHTML = html;

  } catch (err) {
    console.error('Error loading messages:', err);
    container.innerHTML = '<p>Error loading your messages.</p>';
  }
});






document.addEventListener('submit', async (e) => {
  if (e.target.classList.contains('replyForm')) {
    e.preventDefault();

    const form = e.target;
    const petId = form.getAttribute('data-pet');
    const toUser = form.getAttribute('data-to');
    const message = form.querySelector('textarea').value;

    try {
      await addDoc(collection(db, 'petMessages'), {
        petId,
        toUser,
        fromUser: auth.currentUser.uid,
        fromEmail: auth.currentUser.email,
        message,
        createdAt: new Date()
      });
      alert('✅ Reply sent!');
      form.reset();
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('❌ Error sending reply');
    }
  }
});

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-message')) {

    const messageId = e.target.getAttribute('data-id');
    const confirmDelete = confirm('Você quer deletar essa mensagem?');

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'petMessages', messageId));
      alert('Mensagem deletada com sucesso!');
      e.target.closest('li').remove();
    } catch (err) {
      console.error('Erro ao deletar mensagem');
    }
  }
});

document.getElementById('btnLogout').addEventListener('click', async () => {
  try {
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Erro ao sair:', err);
    alert('Erro ao fazer logout.');
  }
});