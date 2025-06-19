// admin.js
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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const openModalBtn    = document.getElementById('openModal');
const overlay         = document.getElementById('modalOverlay');
const cancelBtn       = document.getElementById('cancelBtn');
const form            = document.getElementById('createForm');
const modalTitle      = document.getElementById('modalTitle');
const cardsContainer  = document.getElementById('cardsContainer');
let editingId = null, cropper = null;

// Renderização de cards
function renderCards() {
  cardsContainer.innerHTML = '';
  cardsContainer.appendChild(openModalBtn);
  db.ref('items').once('value').then(snap => {
    snap.forEach(child => {
      const item = { id: child.key, ...child.val() };
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc.replace(/\n/g,'<br>')}</div>
        <div class="footer">
          <div class="item-price">R$ ${parseFloat(item.price).toFixed(2)}</div>
          <div class="actions">
            <button onclick="openEditModal('${item.id}')">✎</button>
            <button onclick="if(confirm('Excluir?')) db.ref('items/${item.id}').remove().then(renderCards)">
              🗑️
            </button>
          </div>
        </div>`;
      cardsContainer.append(card);
    });
  });
}

// Abre modal de edição com imagem carregada
function openEditModal(id) {
  db.ref('items/'+id).once('value').then(snap => {
    const data = snap.val();
    editingId = id;
    modalTitle.textContent = 'Editar Produto';
    form.itemName.value     = data.name;
    form.itemDesc.value     = data.desc;
    form.itemPrice.value    = data.price;
    form.itemCategory.value = data.category;

    const img = document.getElementById('imagePreview');
    const container = document.getElementById('imagePreviewContainer');
    if (cropper) cropper.destroy();
    img.src = data.image;
    container.style.display = 'block';
    cropper = new Cropper(img, {
      aspectRatio: NaN,
      viewMode: 1,
      autoCropArea: 1,
      movable: true,
      zoomable: true,
      guides: true,
      background: false,
    });

    overlay.style.display = 'flex';
  });
}

// Fecha modal
function closeModal() {
  overlay.style.display = 'none';
  form.reset();
  editingId = null;
  modalTitle.textContent = 'Criar Novo Produto';
  if (cropper) { cropper.destroy(); cropper = null; }
  document.getElementById('imagePreviewContainer').style.display = 'none';
}

// Inicialização de eventos
openModalBtn.onclick = () => { closeModal(); overlay.style.display = 'flex'; };
cancelBtn.onclick = closeModal;
overlay.onclick = e => { if (e.target === overlay) closeModal(); };
document.addEventListener('DOMContentLoaded', renderCards);

// Tratamento de nova imagem
form.itemImage.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = document.getElementById('imagePreview');
  const container = document.getElementById('imagePreviewContainer');
  if (cropper) cropper.destroy();

  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
    container.style.display = 'block';
    cropper = new Cropper(img, {
      aspectRatio: NaN,
      viewMode: 1,
      autoCropArea: 1,
      movable: true,
      zoomable: true,
      guides: true,
      background: false,
    });
  };
  reader.readAsDataURL(file);
  document.getElementById('resetCrop').onclick = () => { if (cropper) cropper.reset(); };
});

// Submit com crop ou imagem existente
form.onsubmit = e => {
  e.preventDefault();
  const saveImage = imageData => {
    const payload = {
      name: form.itemName.value,
      desc: form.itemDesc.value,
      price: parseFloat(form.itemPrice.value),
      category: form.itemCategory.value,
      image: imageData,
      createdAt: new Date().toISOString()
    };
    const action = editingId
      ? db.ref('items/'+editingId).set(payload)
      : db.ref('items').push(payload);
    action.then(() => { closeModal(); renderCards(); }).catch(console.error);
  };

  if (cropper) {
    const canvas = cropper.getCroppedCanvas({ maxWidth: 800, maxHeight: 800 });
    saveImage(canvas.toDataURL('image/jpeg', 0.9));
  } else if (editingId) {
    db.ref('items/'+editingId).once('value').then(snap => saveImage(snap.val().image));
  } else {
    alert('Por favor, selecione uma imagem.');
  }
};
