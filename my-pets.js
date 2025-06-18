import { db, auth } from './firebase-config.js';
import {
  updateDoc,
  doc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const divLista = document.getElementById('listaMeusPets');
const btnLogout = document.getElementById('btnLogout');


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const q = query(collection(db, 'petsPerdidos'), where('usuarioId', '==', user.uid));

  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      divLista.innerHTML = '<p>Você ainda não cadastrou nenhum pet.</p>';
      return;
    }

    let html = '<ul class="cards-wrapper">';
    snapshot.forEach(doc => {
      const pet = doc.data();
      const id = doc.id;

      html += `
        <li class="pet-card">
          ${pet.imagem ? `<img src="${pet.imagem}" alt="${pet.nome}">` : ''}
          <div class="pet-card-content">
            <strong>${pet.nome}</strong>
            <p>Status: ${pet.status}</p>
            <p>Local: ${pet.local}</p>
            <br>
            ${pet.status === 'perdido' ? `<button data-id="${id}" class="button btn-found">Encontrado</button>` : ''}
            <br><br>
            <a href="#" data-id="${id}" class="btn-delete" style="color: #AF03C6; cursor: pointer;">Deletar</a>
          </div>
        </li>
      `;
    });
    html += '</ul>';
    divLista.innerHTML = html;

  } catch (err) {
    console.error('Erro ao carregar seus pets:', err);
    divLista.innerHTML = '<p>Erro ao carregar seus pets.</p>';
  }
});


document.addEventListener('click', async (e) => {
  // Marcar pet como encontrado
  if (e.target.classList.contains('btn-found')) {
    const petId = e.target.getAttribute('data-id');
    if (!confirm('Tem certeza que este pet foi encontrado?')) return;

    try {
      const petRef = doc(db, 'petsPerdidos', petId);
      await updateDoc(petRef, { status: 'encontrado' });
      alert('✅ Pet marcado como encontrado.');
      location.reload();
    } catch (err) {
      console.error('Erro ao atualizar pet:', err);
      alert('❌ Falha ao atualizar o status do pet.');
    }
  }


  if (e.target.classList.contains('btn-delete')) {
    e.preventDefault(); // previne ação padrão do <a>
    const petId = e.target.getAttribute('data-id');
    if (!confirm('Você realmente quer deletar este pet?')) return;

    try {
      const petRef = doc(db, 'petsPerdidos', petId);
      await deleteDoc(petRef);
      alert('🗑️ Pet deletado com sucesso.');
      location.reload();
    } catch (err) {
      console.error('Erro ao deletar pet:', err);
      alert('❌ Falha ao deletar o pet.');
    }
  }
});


btnLogout.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'login.html';
});
