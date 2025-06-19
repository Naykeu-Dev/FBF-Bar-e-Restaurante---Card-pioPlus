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
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  document.addEventListener('DOMContentLoaded', () => {
    const menuList = document.getElementById('menu-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let allItems = [];

    function renderMenu(items) {
  menuList.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'col-sm-6 col-md-4 col-lg-3';
    li.innerHTML = `
      <div class="card h-100">
        <img src="${item.image}"
             class="card-img-top"
             alt="${item.name}"
             style="cursor: zoom-in;">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text text-muted item-desc">
            ${item.desc.replace(/\n/g, '<br>')}
          </p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <span class="price-tag">R$ ${parseFloat(item.price).toFixed(2)}</span>
        </div>
      </div>`;
    menuList.appendChild(li);
  });
}


    // Filtro
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-cat');
        const filtered = cat === 'all' ? allItems : allItems.filter(i => i.category === cat);
        renderMenu(filtered);
      });
    });

    // Carrega os dados do Realtime Database
    database.ref('items').once('value')
      .then(snapshot => {
        const data = snapshot.val();
        allItems = Object.keys(data || {}).map(key => data[key]);
        renderMenu(allItems);
      })
      .catch(err => console.error('Erro ao carregar itens:', err));
  });


// Menu
const toggleBtn = document.querySelector('.menu-toggle');
const closeBtn = document.querySelector('.menu-close');
const mobileMenu = document.getElementById('mobileMenu');

toggleBtn.addEventListener('click', () => {
  mobileMenu.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('active');
});




// inicializa o Bootstrap Modal
const imgModalEl = document.getElementById('imageModal');
const bsModal   = new bootstrap.Modal(imgModalEl);
const modalImg   = document.getElementById('modalImage');

// delegação: um único listener no container #menu-list
document.getElementById('menu-list').addEventListener('click', e => {
  // se clicou em IMG de card
  if (e.target.classList.contains('card-img-top')) {
    modalImg.src = e.target.src;
    bsModal.show();
  }
});

// dentro de renderMenu(), remova qualquer chamada a enableImageZoom()
// (não será mais necessária, pois a delegação cuida de todos)
function renderMenu(items) {
  menuList.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'col-sm-6 col-md-4 col-lg-3';
    li.innerHTML = `
      <div class="card h-100">
        <img src="${item.image}" class="card-img-top" alt="${item.name}" style="cursor: zoom-in;">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text text-muted">${item.desc}</p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <span class="price-tag">R$ ${parseFloat(item.price).toFixed(2)}</span>
        </div>
      </div>
    `;
    menuList.appendChild(li);
  });
}
