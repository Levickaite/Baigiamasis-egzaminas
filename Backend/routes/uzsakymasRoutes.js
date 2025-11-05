import express from 'express';
import { createOrder, getUzsakymas
 } from '../controllers/uzsakymasController.js';

import Uzsakymas from '../models/uzsakymasModelis.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

router.post('/create', requireAuth, createOrder);
router.get('/', requireAuth, getUzsakymas);
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Uzsakymas.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: "Nerastas užsakymas" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
