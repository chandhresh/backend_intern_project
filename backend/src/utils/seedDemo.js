const User = require('../models/User');
const Product = require('../models/Product');

module.exports = async function seedDemo() {
  try {
    const adminEmail = 'admin@example.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({ name: 'Demo Admin', email: adminEmail, password: 'password123', role: 'admin' });
      console.log('Demo admin created: admin@example.com / password123');
    } else {
      console.log('Demo admin already exists');
    }

    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.create([
        { name: 'Apple iPhone 14', price: 799, category: 'Electronics', stock: 50 },
        { name: 'Nike Air Max 2021', price: 150, category: 'Footwear', stock: 30 },
        { name: 'Sony WH-1000XM4', price: 349, category: 'Electronics', stock: 20 }
      ]);
      console.log('Demo products inserted');
    } else {
      console.log('Products already present');
    }
  } catch (err) {
    console.error('Seed error', err.message);
  }
};
