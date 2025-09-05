// server/scripts/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productivity-hub';

async function run() {
  await mongoose.connect(MONGO);
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'AdminPass123!';
  const name = process.argv[4] || 'Admin User';

  let user = await User.findOne({ email });
  if (user) {
    console.log('User already exists:', email, 'role=', user.role);
    if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log('Promoted existing user to admin.');
    }
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  user = await User.create({ name, email, passwordHash, role: 'admin' });
  console.log('Admin user created:', { email, name, role: user.role });
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
