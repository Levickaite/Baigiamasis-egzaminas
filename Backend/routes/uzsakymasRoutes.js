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
      // normalize status string to be robust against different capitalizations/words
      const s = (status || '').toString().toLowerCase();
      let targetCarId = updated.automobilis;

      // if order doesn't have automobilis id, try to find a matching car by model/price/year
      if (!targetCarId) {
        try {
          const found = await Automobilis.findOne({ model: updated.model, price: updated.price, year: updated.year });
          if (found) {
            targetCarId = found._id;
            console.log('Found matching automobilis for order', id, '->', targetCarId);
          }
        } catch (findErr) {
          console.warn('Error finding matching automobilis for order', id, findErr.message);
        }
      }

      if (targetCarId) {
        // Desired mapping: 'įvykdyta' -> parduotas, 'patvirtinta' -> rezervuotas
        if (s.includes('įvykd') || s.includes('įvykdyta') || s.includes('įvykdyti')) {
          await Automobilis.findByIdAndUpdate(targetCarId, { parduotas: true, rezervuotas: false });
        } else if (s.includes('patvirt') || s.includes('patvirtinta') || s.includes('rezerv')) {
          await Automobilis.findByIdAndUpdate(targetCarId, { rezervuotas: true, parduotas: false });
        } else if (s.includes('atšauk') || s.includes('atmest') || s.includes('lauki')) {
          await Automobilis.findByIdAndUpdate(targetCarId, { rezervuotas: false, parduotas: false });
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
