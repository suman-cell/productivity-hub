// server/test-mongo.js
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productivity-hub';

async function test() {
  try {
    await mongoose.connect(MONGO);
    console.log('✅ Mongoose connected successfully');
    // quick write/read test
    const TestSchema = new mongoose.Schema({ hello: String });
    const Test = mongoose.model('Test', TestSchema);
    const doc = await Test.create({ hello: 'world' });
    const found = await Test.findById(doc._id).lean();
    console.log('Read back:', found);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Mongoose connection failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}
test();
