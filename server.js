require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Probar conexión al iniciar
(async () => {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('✅ Conexión a la base de datos correcta');
  } catch (err) {
    console.error('❌ Error de conexión a MySQL:', err);
  }
})();

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('API corriendo correctamente');
});

//-------------------------
// Obtener todos los productos
app.get('/productos', async (req, res) => {
  const { search = '', page = 1, pageSize = 10, sort = 'id' } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const [rows] = await db.query(
      `SELECT * FROM productos 
       WHERE nombre LIKE ? OR sku LIKE ? 
       ORDER BY ${sort} 
       LIMIT ? OFFSET ?`,
      [`%${search}%`, `%${search}%`, parseInt(pageSize), parseInt(offset)]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});


// Obtener producto por ID
app.get('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).json({ error: 'Error al obtener el producto', detalle: err.message });
  }
});

// Crear producto
app.post('/productos', async (req, res) => {
  const { nombre, sku, precio, stock, categoria } = req.body;

  if (!nombre || !sku || !precio || !categoria) {
    return res.status(400).json({ error: 'Nombre, SKU, precio y categoría son obligatorios' });
  }

  if (precio <= 0 || stock < 0) {
    return res.status(400).json({ error: 'Precio debe ser > 0 y stock >= 0' });
  }

  try {
    const [existe] = await db.query('SELECT * FROM productos WHERE sku = ?', [sku]);
    if (existe.length > 0) return res.status(400).json({ error: 'SKU ya existe' });

    const [result] = await db.query(
      'INSERT INTO productos (nombre, sku, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)',
      [nombre, sku, precio, stock || 0, categoria]
    );

    res.status(201).json({ id: result.insertId, nombre, sku, precio, stock: stock || 0, categoria });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear el producto', detalle: err.message });
  }
});

// Actualizar producto
app.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, sku, precio, stock, categoria } = req.body;

  if (!nombre || !sku || !precio || !categoria) {
    return res.status(400).json({ error: 'Nombre, SKU, precio y categoría son obligatorios' });
  }

  if (precio <= 0 || stock < 0) {
    return res.status(400).json({ error: 'Precio debe ser > 0 y stock >= 0' });
  }

  try {
    const [exist] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (exist.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const [skuExist] = await db.query('SELECT * FROM productos WHERE sku = ? AND id != ?', [sku, id]);
    if (skuExist.length > 0) return res.status(400).json({ error: 'SKU ya existe' });

    await db.query(
      'UPDATE productos SET nombre=?, sku=?, precio=?, stock=?, categoria=? WHERE id=?',
      [nombre, sku, precio, stock, categoria, id]
    );

    res.json({ id, nombre, sku, precio, stock, categoria });
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar el producto', detalle: err.message });
  }
});

// Eliminar producto
app.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar el producto', detalle: err.message });
  }
});


const PORT_SERVER = 3000;
app.listen(PORT_SERVER, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT_SERVER}`);
});
