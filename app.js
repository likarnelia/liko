const API = 'http://localhost:3000/api';
let products = [];
let cart = [];
let token = localStorage.getItem('token');

const catalog = document.getElementById('catalog');
const cartCount = document.getElementById('cart-count');
const cartSum = document.getElementById('cart-sum');
const authGuest = document.getElementById('auth-guest');
const authUser = document.getElementById('auth-user');
const userEmailSpan = document.getElementById('user-email');

function updateAuthUI() {
  if (token) {
    authGuest.hidden = true;
    authUser.hidden = false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (userEmailSpan) userEmailSpan.textContent = payload.email;
  } else {
    authGuest.hidden = false;
    authUser.hidden = true;
  }
}

function renderProducts() {
  catalog.innerHTML = products.map(p => `
    <div class="card">
      <div class="category">${p.category}</div>
      <h3>${p.title}</h3>
      <div class="price">${Number(p.price).toLocaleString('ru-RU')} ₽</div>
      <div class="stock">В наличии: ${p.stock} шт.</div>
      <button data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>В корзину</button>
    </div>
  `).join('');
}

function renderCart() {
  cartCount.textContent = cart.length;
  cartSum.textContent = cart.reduce((sum, p) => sum + Number(p.price), 0).toLocaleString('ru-RU');
}

catalog.addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') return;
  const product = products.find(p => p.id === Number(e.target.dataset.id));
  if (product) {
    cart.push(product);
    renderCart();
  }
});

async function loadProducts() {
  try {
    const response = await fetch(`${API}/products`);
    products = await response.json();
    renderProducts();
  } catch (err) {
    catalog.innerHTML = '<p>Не удалось загрузить товары. Запущен ли сервер?</p>';
  }
}

// --- Обработчики кнопок ---
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    token = data.token;
    localStorage.setItem('token', token);
    updateAuthUI();
    alert('Вход выполнен!');
  } catch (err) {
    alert('Ошибка входа: ' + err.message);
  }
});

document.getElementById('register-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    alert('Регистрация успешна! Теперь нажмите "Войти"');
  } catch (err) {
    alert('Ошибка регистрации: ' + err.message);
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  token = null;
  localStorage.removeItem('token');
  updateAuthUI();
});

document.getElementById('checkout').addEventListener('click', async () => {
  if (!token) return alert('Требуется вход');
  if (cart.length === 0) return alert('Корзина пуста');
  
  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items: cart.map(p => ({ id: p.id, quantity: 1 })) })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    alert(`Заказ №${data.orderId} оформлен! Сумма: ${data.total} ₽`);
    cart = [];
    renderCart();
    loadProducts();
  } catch (err) {
    alert('Ошибка заказа: ' + err.message);
  }
});

// Запуск
updateAuthUI();
renderCart();
loadProducts();