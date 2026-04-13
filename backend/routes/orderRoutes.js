const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(addOrderItems).get(getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(getOrderById).put(updateOrderStatus);

module.exports = router;
