const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');
const {
  listOrders,
  updateOrderStatus,
  createOrder,
  getOrderHistory,
  updatePagat,
} = require('../controllers/orders.controller');

const router = Router();
const requireKitchen = [requireAuth, requireRole('cuina')];
const requireAdmin = [requireAuth, requireRole('admin')];

router.post('/', createOrder);
router.get('/history', requireAdmin, getOrderHistory);
router.get('/', requireKitchen, listOrders);
router.patch('/:id', requireKitchen, updateOrderStatus);
router.patch('/:id/pagat', requireAdmin, updatePagat);

module.exports = router;
