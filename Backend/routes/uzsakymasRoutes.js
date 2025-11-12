import express from 'express';
import { createOrder, getUzsakymas
 } from '../controllers/uzsakymasController.js';

import Uzsakymas from '../models/uzsakymasModelis.js';
import Automobilis from '../models/autoModelis.js';
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
    // if the order is linked to a car, update its rezervuotas/parduotas flags
    try {
      if (updated.automobilis) {
        if (status === 'patvirtintas') {
          await Automobilis.findByIdAndUpdate(updated.automobilis, { parduotas: true, rezervuotas: false });
        } else if (status === 'rezervuotas') {
          await Automobilis.findByIdAndUpdate(updated.automobilis, { rezervuotas: true, parduotas: false });
        } else if (status === 'atšauktas' || status === 'nepatvirtinta' || status === 'Nepatvirtinta') {
          await Automobilis.findByIdAndUpdate(updated.automobilis, { rezervuotas: false, parduotas: false });
        }
      }
    } catch (e) {
      console.warn('Failed to update automobilis status for order', id, e.message);
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
