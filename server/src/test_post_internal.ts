import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { Promo } from './models/Promo';
import { connectDB } from './db';
import { adminPromoRouter } from './routes/admin/promo.routes';

async function run() {
  await connectDB();
  console.log('Connected to DB');

  const app = express();
  app.use(express.json());

  // Let's bypass requireAdmin for testing
  // We can just define a middleware that overrides req.auth or we can just remove requireAdmin by monkeypatching the router stack!
  // In Express, adminPromoRouter is a Router. We can find the middleware layer for requireAdmin and remove it.
  // Or simpler: let's copy the routes from promo.routes.ts into a local router for testing.
  const testRouter = express.Router();
  
  // Helper functions copied from promo.routes.ts
  const { AppError } = require('./utils/AppError');
  const { requireText } = require('./utils/helpers');
  const { asyncHandler } = require('./utils/asyncHandler');
  const { ok } = require('./utils/envelope');

  function parsePromoPayload(req: any) {
    const code = String(req.body.code || "").trim().toUpperCase();
    const percentage = Number(req.body.percentage);
    const count = Number(req.body.count);
    const minimumOrderValue = Number(req.body.minimumOrderValue);
    const startsAt = new Date(req.body.startsAt);
    const endsAt = new Date(req.body.endsAt);

    requireText(code, "promo code is required");

    if (Number.isNaN(percentage) || percentage < 1 || percentage > 100) {
      throw new AppError(400, "Percentage must be between 1 and 10");
    }

    if (!Number.isInteger(count) || count < 1) {
      throw new AppError(400, "Promo count must be atleast 1");
    }

    if (Number.isNaN(minimumOrderValue) || minimumOrderValue < 0) {
      throw new AppError(400, "Promo count must be atleast 0 or more");
    }

    if (Number.isNaN(startsAt.getTime())) {
      throw new AppError(400, "Valid start time is required");
    }
    if (Number.isNaN(endsAt.getTime())) {
      throw new AppError(400, "Valid end time is required");
    }

    if (endsAt <= startsAt) {
      throw new AppError(400, "End time should be after start time");
    }

    return {
      code,
      percentage,
      count,
      minimumOrderValue,
      startsAt,
      endsAt,
    };
  }

  testRouter.post(
    "/promos",
    asyncHandler(async (req: any, res: any) => {
      const payload = parsePromoPayload(req);
      const existingPromo = await Promo.findOne({ code: payload.code });
      if (existingPromo) {
        throw new AppError(400, "Promo code already exists");
      }
      await Promo.create(payload);
      res.json(ok({ items: await Promo.find() }));
    })
  );

  app.use('/', testRouter);

  const axios = require('axios');
  const server = app.listen(5002, async () => {
    console.log('Test server listening on 5002');
    try {
      // 1. Let's test with a valid payload
      const testCode = 'VALID' + Math.floor(Math.random() * 100000);
      console.log('Testing valid payload with code:', testCode);
      const res1 = await axios.post('http://localhost:5002/promos', {
        code: testCode,
        percentage: '50',
        count: '100',
        minimumOrderValue: '200',
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 86400000).toISOString(),
      });
      console.log('Valid payload response:', res1.data);

      // 2. Let's test what happens when percentage is outside 1-100 (e.g. 150)
      console.log('Testing percentage > 100...');
      try {
        await axios.post('http://localhost:5002/promos', {
          code: 'INVALID150',
          percentage: '150',
          count: '100',
          minimumOrderValue: '200',
          startsAt: new Date().toISOString(),
          endsAt: new Date(Date.now() + 86400000).toISOString(),
        });
      } catch (err: any) {
        console.log('Expected error for percentage > 100:', err.response?.data);
      }

    } catch (err: any) {
      console.error('Unexpected error:', err.response?.data || err.message);
    } finally {
      server.close();
      await mongoose.disconnect();
    }
  });
}

run();
