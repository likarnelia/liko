const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.static('..')); 
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Создаем подключение к базе данных (называем его pool)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// 1. Маршрут для товаров (исправлен на pool.query)
app.get('/api/products', (req, res) => {
  const sql = `
    SELECT p.id, p.title, p.price, p.stock, c.name AS category 
    FROM products p 
    JOIN categories c ON p.category_id = c.id
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка загрузки товаров' });
    }
    res.json(results);
  });
});

// 2. Маршрут для категорий 
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.promise().execute('SELECT id, name FROM categories ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error("Ошибка в categories:", err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});