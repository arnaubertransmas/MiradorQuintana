const pool = require('../config/db');

const ORDER_STATUSES = ['pending', 'preparing', 'completed', 'cancelled'];
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/;

class OrderInputError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

async function createOrder(req, res) {
  const { nom_client: nomClientRaw, num_taula: numTaulaRaw, items } = req.body;
  const numTaula = Number(numTaulaRaw);
  const nomClient = typeof nomClientRaw === 'string' ? nomClientRaw.trim() : '';

  if (!nomClient) {
    return res.status(400).json({ error: 'nom_client is required' });
  }
  if (!NAME_REGEX.test(nomClient)) {
    return res.status(400).json({ error: 'nom_client must contain letters only (no numbers or symbols)' });
  }
  if (!Number.isInteger(numTaula) || numTaula < 1 || numTaula > 100) {
    return res.status(400).json({ error: 'num_taula must be an integer between 1 and 100' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }
  for (const item of items) {
    if (!Number.isInteger(item.plat_id) || !Number.isInteger(item.quantitat) || item.quantitat <= 0) {
      return res.status(400).json({ error: 'Each item needs a valid plat_id and quantitat > 0' });
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let total = 0;
    const preparedItems = [];

    for (const item of items) {
      const dishResult = await client.query('SELECT id, plat, preu, extres FROM plats WHERE id = $1', [
        item.plat_id,
      ]);
      const dish = dishResult.rows[0];
      if (!dish) {
        throw new OrderInputError(`Dish ${item.plat_id} not found`);
      }

      const availableExtras = Array.isArray(dish.extres) ? dish.extres : [];
      const requestedNames = Array.isArray(item.extres) ? item.extres.map((extra) => extra.nom) : [];
      const matchedExtras = requestedNames.map((nom) => {
        const match = availableExtras.find((extra) => extra.nom === nom);
        if (!match) {
          throw new OrderInputError(`Extra "${nom}" is not valid for dish "${dish.plat}"`);
        }
        return match;
      });

      const unitPrice = Number(dish.preu) + matchedExtras.reduce((sum, extra) => sum + Number(extra.preu), 0);
      total += unitPrice * item.quantitat;

      preparedItems.push({
        dishId: dish.id,
        dishName: dish.plat,
        quantitat: item.quantitat,
        unitPrice,
        extras: matchedExtras,
      });
    }

    const orderResult = await client.query(
      `INSERT INTO orders (nom_client, num_taula, estat, preu_total)
       VALUES ($1, $2, 'preparing', $3)
       RETURNING id, nom_client, num_taula, estat, preu_total, created_at`,
      [nomClient, numTaula, total]
    );
    const order = orderResult.rows[0];

    for (const item of preparedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, plat_id, plat_nom, quantitat, preu_unitat, extres)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.dishId, item.dishName, item.quantitat, item.unitPrice, JSON.stringify(item.extras)]
      );
    }

    await client.query('COMMIT');
    return res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    if (err instanceof OrderInputError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Create order error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

async function listOrders(req, res) {
  const { status } = req.query;

  if (status && !ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status filter' });
  }

  const statuses = status ? [status] : ['pending', 'preparing'];

  try {
    const result = await pool.query(
      `SELECT o.id, o.nom_client, o.num_taula, o.estat, o.preu_total, o.pagat, o.created_at, o.updated_at,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', oi.id,
                    'plat_nom', oi.plat_nom,
                    'quantitat', oi.quantitat,
                    'preu_unitat', oi.preu_unitat,
                    'extres', oi.extres
                  ) ORDER BY oi.id
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
              ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.estat = ANY($1)
       GROUP BY o.id
       ORDER BY o.created_at ASC`,
      [statuses]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('List orders error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getOrderHistory(req, res) {
  try {
    const result = await pool.query(
      `SELECT o.id, o.nom_client, o.num_taula, o.estat, o.preu_total, o.pagat, o.created_at, o.updated_at,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', oi.id,
                    'plat_nom', oi.plat_nom,
                    'quantitat', oi.quantitat,
                    'preu_unitat', oi.preu_unitat,
                    'extres', oi.extres
                  ) ORDER BY oi.id
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
              ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.created_at >= NOW() - INTERVAL '72 hours'
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Order history error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { estat } = req.body;

  if (!ORDER_STATUSES.includes(estat)) {
    return res.status(400).json({ error: `estat must be one of: ${ORDER_STATUSES.join(', ')}` });
  }

  try {
    const result = await pool.query(
      `UPDATE orders SET estat = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, num_taula, estat, preu_total, updated_at`,
      [estat, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Update order status error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updatePagat(req, res) {
  const { id } = req.params;
  const { pagat } = req.body;

  if (typeof pagat !== 'boolean') {
    return res.status(400).json({ error: 'pagat must be a boolean' });
  }

  try {
    if (pagat) {
      const existing = await pool.query('SELECT estat FROM orders WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      if (!['completed', 'cancelled'].includes(existing.rows[0].estat)) {
        return res.status(400).json({ error: 'Only completed or cancelled orders can be marked as paid' });
      }
    }

    const result = await pool.query(
      `UPDATE orders SET pagat = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, nom_client, num_taula, estat, preu_total, pagat, updated_at`,
      [pagat, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Update pagat error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { listOrders, updateOrderStatus, createOrder, getOrderHistory, updatePagat };
