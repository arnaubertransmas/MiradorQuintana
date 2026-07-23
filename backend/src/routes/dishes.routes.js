const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');
const {
  listDishes,
  listAllDishes,
  createDish,
  updateDish,
  deleteDish,
} = require('../controllers/dishes.controller');

const router = Router();
const requireAdmin = [requireAuth, requireRole('admin')];

router.get('/', listDishes);
router.get('/all', requireAdmin, listAllDishes);
router.post('/', requireAdmin, createDish);
router.put('/:id', requireAdmin, updateDish);
router.delete('/:id', requireAdmin, deleteDish);

module.exports = router;
