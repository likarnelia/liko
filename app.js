
const products = [
  { id: 1, title: 'Ноутбук 15"',       category: 'Компьютеры', price: 85000 },
  { id: 2, title: 'Монитор 27"',       category: 'Компьютеры', price: 28000 },
  { id: 3, title: 'Клавиатура',        category: 'Аксессуары', price: 6500 },
  { id: 4, title: 'Мышь беспроводная', category: 'Аксессуары', price: 2500 },
  { id: 5, title: 'Мышь проводная', category: 'Аксессуары', price: 1000 },
  { id: 6, title: 'Наушники проводные', category: 'Аксессуары', price: 3000 },
  { id: 7, title: 'Микрофон', category: 'Аксессуары', price: 10000 },
  { id: 8, title: 'SSD 1тб', category: 'Компьютеры', price: 13000 },
  { id: 9, title: 'Коврик для мыши', category: 'Аксессуары', price: 300 }
];

const cart = [];

const catalog = document.getElementById('catalog');
const cartCount = document.getElementById('cart-count');
const cartSum = document.getElementById('cart-sum');

function renderProducts() {
  catalog.innerHTML = products.map(p => `
    <div class="card">
      <div class="category">${p.category}</div>
      <h3>${p.title}</h3>
      <div class="price">${Number(p.price).toLocaleString('ru-RU')} ₽</div>
      <button data-id="${p.id}">В корзину</button>
    </div>
  `).join('');
}

function renderCart() {
  cartCount.textContent = cart.length;
  cartSum.textContent = cart
    .reduce((sum, p) => sum + Number(p.price), 0)
    .toLocaleString('ru-RU');
}

catalog.addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') return;
  const product = products.find(p => p.id === Number(e.target.dataset.id));
  cart.push(product);
  renderCart();
});

const clearCartBtn = document.getElementById('clear-cart');

clearCartBtn.addEventListener('click', () => {
  cart.length = 0;      // очищаем массив, сохраняя ссылку
  renderCart();
});

renderProducts();