const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();
connectDB();

const products = [
  {
    name: 'Kaftan Royal Elegance',
    description: 'A luxurious white and gold traditional Moroccan kaftan worn at weddings. Hand-embroidered with premium threads.',
    price: 450,
    images: ['/images/kaftan-4.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White/Gold'],
    stock: 5,
  },
  {
    name: 'Midnight Rose Kaftan',
    description: 'Elegant dark kaftan with intricate gold and red details along the center. Perfect for evening events.',
    price: 320,
    images: ['/images/kaftan-6.jpg'],
    sizes: ['M', 'L'],
    colors: ['Black/Gold'],
    stock: 8,
  },
  {
    name: 'Emerald Dream Silk',
    description: 'Breathtaking green kaftan with silver and emerald beadwork. Lightweight and flows gracefully.',
    price: 280,
    images: ['/images/kaftan-2.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Emerald/Silver'],
    stock: 12,
  },
  {
    name: 'Sapphire Ocean Kaftan',
    description: 'Deep blue tones mixed with golden embroidery mimicking traditional Moroccan Zellige tiles.',
    price: 350,
    images: ['/images/kaftan-3.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue/Gold'],
    stock: 4,
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      { name: 'Admin', email: 'admin@marouki.com', password: 'password123', role: 'admin' },
      { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' },
    ]);

    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
