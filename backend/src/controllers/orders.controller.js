const pool = require('../config/db');

const ORDER_STATUSES = ['pending', 'preparing', 'completed', 'cancelled'];

async function listOrders(req, res) {
  const { status } = req.query;

  if (status && !ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status filter' });
  }

  const statuses = status ? [status] : ['pending', 'preparing'];

  try {
    const result = await pool.query(
      `SELECT o.id, o.num_taula, o.estat, o.preu_total, o.stripe_status, o.created_at, o.updated_at,
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

module.exports = { listOrders, updateOrderStatus };
