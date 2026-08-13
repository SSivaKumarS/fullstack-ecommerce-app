#!/usr/bin/env node
require('dotenv').config();

async function run() {
  try {
    const { connectDB } = require('../dist/db');
    const { Category } = require('../dist/models/Category');

    await connectDB();

    const count = await Category.countDocuments();
    if (count > 0) {
      console.log('Categories already exist. Count =', count);
      process.exit(0);
    }

    const sample = [
      { name: 'Men' },
      { name: 'Women' },
      { name: 'Kids' },
      { name: 'Accessories' },
      { name: 'Electronics' },
    ];

    const created = await Category.insertMany(sample);
    console.log('Inserted categories:', created.map((c) => ({ _id: String(c._id), name: c.name })));
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();