const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

router.route('/').post(addOrderItems).get(getOrders);
router.route('/:id').get(getOrderById).put(updateOrderStatus);

module.exports = router;
