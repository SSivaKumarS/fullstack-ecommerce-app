import 'dotenv/config';
import mongoose from 'mongoose';
import { Promo } from './models/Promo';

async function test() {
  console.log('Connecting to:', process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('Connected to DB');

  try {
    const promo = await Promo.create({
      code: 'TESTPROMO10',
      percentage: 10,
      count: 100,
      minimumOrderValue: 50,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 86400000),
    });
    console.log('Created promo successfully:', promo);
  } catch (error) {
    console.error('Error creating promo:', error);
  } finally {
    await mongoose.disconnect();
  }
}

test();
