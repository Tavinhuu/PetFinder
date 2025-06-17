import { db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { auth } from './firebase-config.js'; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


let pets = [];

function exibirPets(lista) {
  const div = document.getElementById('listaPets');

  if (lista.length === 0) {
    div.innerHTML = '<p>Nenhum pet encontrado com os filtros aplicados.</p>';
    return;
  }

  let html = '<ul class="cards-wrapper">';
  lista.forEach(pet => {
    
    html += `
  <li class="pet-card">
    <img src="${pet.imagem}" alt="${pet.nome}">
    <div class="pet-card-content">
      <strong>${pet.nome}</strong>
      <p>Raça: ${pet.raca}</p>
      <p>Local: ${pet.local}</p>
      <p>Data: ${pet.data}</p>
      <p>Telefone: ${pet.telefone}</p>
      <a class="button" href="pet-details.html?id=${pet.id}">Ver Detalhes</a>
    </div>
  </li>
    `;
  });
  html += '</ul>';
  div.innerHTML = html;
}


async function carregarPets() {
  try {
    const querySnapshot = await getDocs(collection(db, 'petsPerdidos'));
    pets = [];
    querySnapshot.forEach(documento => {
  const petData = documento.data();
  petData.id = documento.id;
  pets.push(petData);
});
    exibirPets(pets);
  } catch (err) {
    console.error('Erro ao carregar pets:', err);
    document.getElementById('listaPets').innerHTML = '<p>Erro ao carregar pets.</p>';
  }
}


function aplicarFiltros() {
  const nome = document.getElementById('filtroNome').value.toLowerCase();
  const raca = document.getElementById('filtroRaca').value.toLowerCase();
  const local = document.getElementById('filtroLocal').value.toLowerCase();

  const filtrados = pets.filter(pet =>
    (!nome || pet.nome.toLowerCase().includes(nome)) &&
    (!raca || pet.raca.toLowerCase().includes(raca)) &&
    (!local || pet.local.toLowerCase().includes(local))
  );

  exibirPets(filtrados);
}

document.addEventListener('DOMContentLoaded', () => {
  carregarPets();

  document.getElementById('btnFiltrar').addEventListener('click', aplicarFiltros);
  document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('filtroNome').value = '';
    document.getElementById('filtroRaca').value = '';
    document.getElementById('filtroLocal').value = '';
    exibirPets(pets);
  });
});

onAuthStateChanged(auth, (user) => {
  const authControl = document.getElementById('authControl');
  const myPetsLink = document.getElementById('myPetsLink');
  const InboxLink = document.getElementById('inboxLink');

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
    if (inboxLink) {
      InboxLink.style.display = 'list-item';
    }

  } else {
    if (authControl) {
      authControl.innerHTML = `<a href="login.html" class="button">Login</a>`;
    }

    if (myPetsLink) {
      myPetsLink.style.display = 'none';
    }
    if (inboxLink) {
      InboxLink.style.display = 'none';
    }
  }
});

