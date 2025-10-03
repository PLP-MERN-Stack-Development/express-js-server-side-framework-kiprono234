// routes/products.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

let products = []; // in-memory "DB"

// =============================
// 📊 GET product stats
// =============================
router.get('/stats', (req, res) => {
  const totalProducts = products.length;
  const averagePrice =
    totalProducts > 0
      ? products.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts
      : 0;

  const countByCategory = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalProducts,
    averagePrice,
    countByCategory,
  });
});

// =============================
// 🔎 SEARCH by name
// =============================
router.get('/search', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Search query "name" is required' });
  }
  const results = products.filter((p) =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json(results);
});

// =============================
// GET all products (with filtering + pagination)
// =============================
router.get('/', (req, res) => {
  let result = [...products];

  // Filtering by category
  if (req.query.category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginated = result.slice(startIndex, endIndex);

  res.json({
    total: result.length,
    page,
    limit,
    data: paginated,
  });
});

// =============================
// GET product by ID
// =============================
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// =============================
// POST create product
// =============================
router.post('/', (req, res) => {
  const newProduct = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description || '',
    price: req.body.price || 0,
    category: req.body.category || 'Uncategorized',
    inStock: req.body.inStock ?? true,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// =============================
// PUT update product
// =============================
router.put('/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// =============================
// DELETE product
// =============================
router.delete('/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
