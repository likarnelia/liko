
const products = [
  { id: 1, title: 'Ноутбук 15"',       category: 'Компьютеры', price: 85000 },
  { id: 2, title: 'Монитор 27"',       category: 'Компьютеры', price: 28000 },
  { id: 3, title: 'Клавиатура',        category: 'Аксессуары', price: 6500 },
  { id: 4, title: 'Мышь беспроводная', category: 'Аксессуары', price: 2500 },
  { id: 5, title: 'Мышь проводная', category: 'Аксессуары', price: 1000 },
  { id: 6, title: 'Наушники проводные', category: 'Аксессуары', price: 3000 },
  { id: 7, title: 'Микрофон', category: 'Аксессуары', price: 10000 }
];

const catalog = document.getElementById('catalog');

function renderProducts() {
  catalog.innerHTML = products.map(p => `
    <div class="card">
      <div class="category">${p.category}</div>
      <h3>${p.title}</h3>
      <div class="price">${p.price.toLocaleString('ru-RU')} ₽</div>
      <button data-id="${p.id}">В корзину</button>
    </div>
  `).join('');
}

catalog.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;

  const id = Number(button.dataset.id);
  const product = products.find(p => p.id === id);

  if (product) {
    console.log(product.title);
  }
});

renderProducts();