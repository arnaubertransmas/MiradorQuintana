const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const dishesRoutes = require('./routes/dishes.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));

// NOTE: the Stripe webhook route needs the raw request body for signature
// verification, so it must be mounted with express.raw() BEFORE this
// express.json() middleware (or excluded from it) once that route is added.
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishesRoutes);
app.use('/api/orders', ordersRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
