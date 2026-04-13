const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
const addOrderItems = async (req, res) => {
  try {
    const { user, customer, products, totalPrice, paymentMethod } = req.body;

    if (products && products.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      // Verify stock for all items before placing order
      for (let i = 0; i < products.length; i++) {
        const item = products[i];
        const product = await Product.findById(item.productId || item.product);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.name} not found` });
        }
        
        if (product.stockItems && product.stockItems.length > 0) {
           const stockItem = product.stockItems.find(si => si.size === item.size && si.color === item.color);
           if (!stockItem || stockItem.stock < item.quantity) {
             return res.status(400).json({ message: `Product "${item.name}" (Size: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}) is out of stock` });
           }
        } else {
           if (product.stock < item.quantity) {
             return res.status(400).json({ message: `Product "${item.name}" is out of stock or does not have enough quantity` });
           }
        }
      }

      // Decrement stock for all items
      for (let i = 0; i < products.length; i++) {
        const item = products[i];
        const product = await Product.findById(item.productId || item.product);
        
        if (product.stockItems && product.stockItems.length > 0) {
           const stockItem = product.stockItems.find(si => si.size === item.size && si.color === item.color);
           if (stockItem) {
             stockItem.stock -= item.quantity;
           }
        }
        product.stock -= item.quantity;
        await product.save();
      }

      const order = new Order({
        user,
        customer,
        products,
        totalPrice,
        paymentMethod,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'customer.email': req.user.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
};
