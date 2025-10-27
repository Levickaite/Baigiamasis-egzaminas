import express from 'express';
import { createOrder } from '../controllers/uzsakymasController';

import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

router.post('/create', requireAuth, createOrder);

export default router;