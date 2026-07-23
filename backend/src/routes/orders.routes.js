const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');
const { listOrders, updateOrderStatus, createOrder, simulatePayment } = require('../controllers/orders.controller');

const router = Router();
const requireKitchen = [requireAuth, requireRole('cuina')];

router.post('/', createOrder);
router.post('/:id/simulate-payment', simulatePayment);
router.get('/', requireKitchen, listOrders);
router.patch('/:id', requireKitchen, updateOrderStatus);

module.exports = router;
