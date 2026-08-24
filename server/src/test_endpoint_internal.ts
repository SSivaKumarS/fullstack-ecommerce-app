import 'dotenv/config';
const mockAuth = { userId: 'user_3GZQRbiKPVjF124eJDAU5iCNfOr' };

// Mock @clerk/express module in require.cache
const clerkExpressPath = require.resolve('@clerk/express');
require.cache[clerkExpressPath] = {
  id: clerkExpressPath,
  filename: clerkExpressPath,
  loaded: true,
  path: '',
  paths: [],
  children: [],
  exports: {
    clerkMiddleware: () => (req: any, res: any, next: any) => next(),
    getAuth: () => mockAuth,
    requireAuth: () => (req: any, res: any, next: any) => next(),
  }
} as any;

import express from 'express';
import mongoose from 'mongoose';
import { adminPromoRouter } from './routes/admin/promo.routes';
import { connectDB } from './db';

async function run() {
  await connectDB();
  console.log('Connected to DB');

  const app = express();
  app.use(express.json());
  app.use('/', adminPromoRouter);

  const axios = require('axios');
  const server = app.listen(5001, async () => {
    console.log('Test server listening on 5001');

    try {
      const payload = {
        code: 'TESTPROMO50',
        percentage: '50',
        count: '100',
        minimumOrderValue: '200',
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 86400000).toISOString(),
      };

      console.log('Sending payload to mock server:', payload);
      const res = await axios.post('http://localhost:5001/promos', payload);
      console.log('Success response:', res.data);
    } catch (err: any) {
      console.error('Error response status:', err.response?.status);
      console.error('Error response data:', err.response?.data);
    } finally {
      server.close();
      await mongoose.disconnect();
    }
  });
}

run();
