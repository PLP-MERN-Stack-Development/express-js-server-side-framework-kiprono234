// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
const logger = require('./middleware/logger');

// routes
const productRoutes = require('./routes/products');

// error classes
const NotFoundError = require('./errors/NotFoundError');

// parse json
app.use(express.json()); // built-in
app.use(logger);

// mount product routes
app.use('/api/products', productRoutes);

// 404 for unknown routes
app.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
