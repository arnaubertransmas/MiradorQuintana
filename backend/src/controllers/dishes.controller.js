const pool = require('../config/db');

function validateDishInput(body) {
  const { plat, categoria, preu, extres, disponibilitat, imatge, descripcio } = body;
  const errors = [];

  if (typeof plat !== 'string' || plat.trim().length === 0) {
    errors.push('plat is required');
  }
  if (typeof categoria !== 'string' || categoria.trim().length === 0) {
    errors.push('categoria is required');
  }
  const preuNumber = Number(preu);
  if (Number.isNaN(preuNumber) || preuNumber <= 0) {
    errors.push('preu must be a positive number');
  }
  if (extres !== undefined && extres !== null && !Array.isArray(extres)) {
    errors.push('extres must be an array');
  }
  if (disponibilitat !== undefined && typeof disponibilitat !== 'boolean') {
    errors.push('disponibilitat must be a boolean');
  }
  if (imatge !== undefined && imatge !== null && typeof imatge !== 'string') {
    errors.push('imatge must be a string');
  }
  if (descripcio !== undefined && descripcio !== null && typeof descripcio !== 'string') {
    errors.push('descripcio must be a string');
  }

  return errors;
}

async function listDishes(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, plat AS dish, categoria AS category, preu AS price, extres AS extras,
              imatge AS image, descripcio AS description
       FROM plats
       WHERE disponibilitat = true
       ORDER BY categoria, plat`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('List dishes error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function listAllDishes(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, plat AS dish, categoria AS category, preu AS price, extres AS extras,
              imatge AS image, descripcio AS description, disponibilitat AS available
       FROM plats
       ORDER BY categoria, plat`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('List all dishes error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function createDish(req, res) {
  const errors = validateDishInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  const { plat, categoria, preu, extres, disponibilitat, imatge, descripcio } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO plats (plat, categoria, preu, extres, disponibilitat, imatge, descripcio)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, plat AS dish, categoria AS category, preu AS price, extres AS extras,
                 imatge AS image, descripcio AS description, disponibilitat AS available`,
      [
        plat.trim(),
        categoria.trim(),
        preu,
        extres ? JSON.stringify(extres) : null,
        disponibilitat ?? true,
        imatge?.trim() || null,
        descripcio?.trim() || null,
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create dish error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateDish(req, res) {
  const { id } = req.params;
  const errors = validateDishInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  const { plat, categoria, preu, extres, disponibilitat, imatge, descripcio } = req.body;

  try {
    const result = await pool.query(
      `UPDATE plats
       SET plat = $1, categoria = $2, preu = $3, extres = $4, disponibilitat = $5, imatge = $6, descripcio = $7
       WHERE id = $8
       RETURNING id, plat AS dish, categoria AS category, preu AS price, extres AS extras,
                 imatge AS image, descripcio AS description, disponibilitat AS available`,
      [
        plat.trim(),
        categoria.trim(),
        preu,
        extres ? JSON.stringify(extres) : null,
        disponibilitat ?? true,
        imatge?.trim() || null,
        descripcio?.trim() || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Update dish error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteDish(req, res) {
  const { id } = req.params;

  try {
    const referenced = await pool.query('SELECT 1 FROM order_items WHERE plat_id = $1 LIMIT 1', [id]);

    if (referenced.rows.length > 0) {
      const result = await pool.query(
        `UPDATE plats SET disponibilitat = false WHERE id = $1
         RETURNING id, plat AS dish, categoria AS category, preu AS price, extres AS extras, disponibilitat AS available`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      return res.json({ softDeleted: true, dish: result.rows[0] });
    }

    const result = await pool.query('DELETE FROM plats WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    return res.json({ softDeleted: false, id: result.rows[0].id });
  } catch (err) {
    console.error('Delete dish error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { listDishes, listAllDishes, createDish, updateDish, deleteDish };
