// Configuração do Firebase
    const firebaseConfig = {
  apiKey: "AIzaSyCEHvY7F90VDJAxGYpU0cjqVizNfZmejRA",
  authDomain: "autenticacao-administrativa.firebaseapp.com",
  databaseURL: "https://autenticacao-administrativa-default-rtdb.firebaseio.com",
  projectId: "autenticacao-administrativa",
  storageBucket: "autenticacao-administrativa.appspot.com",
  messagingSenderId: "724706435418",
  appId: "1:724706435418:web:cc90055d710060cf381363"
};

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    const openModalBtn = document.getElementById('openModal');
    const overlay = document.getElementById('modalOverlay');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('createForm');
    const modalTitle = document.getElementById('modalTitle');
    const cardsContainer = document.getElementById('cardsContainer');
    let editingId = null;

    // Renderiza cards buscando no Realtime Database
    function renderCards() {
      cardsContainer.innerHTML = '';
      cardsContainer.appendChild(openModalBtn);
      db.ref('items').once('value')
        .then(snapshot => {
          snapshot.forEach(childSnapshot => {
            const item = { id: childSnapshot.key, ...childSnapshot.val() };
            const card = document.createElement('div'); card.className = 'card';
            const img = document.createElement('img'); img.src = item.image; img.alt = item.name;
            const nameEl = document.createElement('div'); nameEl.className = 'item-name'; nameEl.textContent = item.name;
            const descEl = document.createElement('div'); descEl.className = 'item-desc';
            descEl.innerHTML = item.desc.replace(/\n/g, '<br>');
            const footer = document.createElement('div'); footer.className = 'footer';
            const priceEl = document.createElement('div'); priceEl.className = 'item-price'; priceEl.textContent = `R$ ${parseFloat(item.price).toFixed(2)}`;
            const actions = document.createElement('div'); actions.className = 'actions';
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '&#9998;'; editBtn.title = 'Editar';
            editBtn.onclick = () => openEditModal(item.id);
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '🗑️'; deleteBtn.title = 'Excluir';
            deleteBtn.onclick = () => {
              if(confirm('Deseja realmente excluir este item?')) {
                db.ref('items/' + item.id).remove().then(renderCards);
              }
            };
            actions.append(editBtn, deleteBtn);
            footer.append(priceEl, actions);
            card.append(img, nameEl, descEl, footer);
            cardsContainer.append(card);
          });
        })
        .catch(err => console.error('Erro ao carregar itens:', err));
    }

    // Abre modal para edição
    function openEditModal(id) {
      db.ref('items/' + id).once('value').then(snapshot => {
        const data = snapshot.val(); editingId = id;
        modalTitle.textContent = 'Editar Produto';
        form.itemName.value = data.name;
        form.itemDesc.value = data.desc;
        form.itemPrice.value = data.price;
        form.itemCategory.value = data.category;
        overlay.style.display = 'flex';
      });
    }

    // Fecha modal
    function closeModal() {
      overlay.style.display = 'none'; form.reset(); editingId = null;
      modalTitle.textContent = 'Criar Novo Produto';
    }

    // Handler de submit (cria ou atualiza)
    form.onsubmit = function(e) {
      e.preventDefault();
      const name = form.itemName.value;
      const desc = form.itemDesc.value;
      const price = form.itemPrice.value;
      const category = form.itemCategory.value;
      const file = form.itemImage.files[0];

      function saveToDatabase(imageData) {
        const payload = { name, desc, price: parseFloat(price), category, image: imageData, createdAt: new Date().toISOString() };
        const action = editingId ? db.ref('items/' + editingId).set(payload)
                                 : db.ref('items').push(payload);
        action.then(() => { closeModal(); renderCards(); })
              .catch(console.error);
      }

      if (file) {
        const reader = new FileReader();
        reader.onload = () => saveToDatabase(reader.result);
        reader.readAsDataURL(file);
      } else if (editingId) {
        // mantém imagem existente
        db.ref('items/' + editingId).once('value').then(snapshot => {
          saveToDatabase(snapshot.val().image);
        });
      }
    };

    // Eventos
    openModalBtn.onclick = () => { editingId = null; closeModal(); overlay.style.display = 'flex'; };
    cancelBtn.onclick = closeModal;
    overlay.onclick = e => { if (e.target === overlay) closeModal(); };
    document.addEventListener('DOMContentLoaded', renderCards);