import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/krepselisController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, getCart);
router.post('/add', requireAuth, addToCart);
router.post('/remove', requireAuth, removeFromCart);

export default router;