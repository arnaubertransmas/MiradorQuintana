const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');
const {
  listOrders,
  updateOrderStatus,
  createOrder,
  simulatePayment,
  getOrderHistory,
} = require('../controllers/orders.controller');

const router = Router();
const requireKitchen = [requireAuth, requireRole('cuina')];
const requireAdmin = [requireAuth, requireRole('admin')];

router.post('/', createOrder);
router.post('/:id/simulate-payment', simulatePayment);
router.get('/history', requireAdmin, getOrderHistory);
router.get('/', requireKitchen, listOrders);
router.patch('/:id', requireKitchen, updateOrderStatus);

module.exports = router;
