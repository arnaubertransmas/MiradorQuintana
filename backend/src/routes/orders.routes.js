const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');
const { listOrders, updateOrderStatus } = require('../controllers/orders.controller');

const router = Router();
const requireKitchen = [requireAuth, requireRole('cuina')];

router.get('/', requireKitchen, listOrders);
router.patch('/:id', requireKitchen, updateOrderStatus);

module.exports = router;
