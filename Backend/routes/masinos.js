import express from 'express'
import * as controller from '../controllers/controllers.js'
import Automobilis from '../models/autoModelis.js'
import mongoose from 'mongoose'

//cloud
import requireAuth from '../middleware/requireAuth.js'
// use multer/cloudinary uploader from middleware
import { upload } from '../middleware/upload.js';



const router = express.Router()
// router.use()
//GET - paimti visus automobilius
router.get('/', controller.getAutomobilis)
//GET - ppaimti vieną automobilį 
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Patikrinti validų Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Neteisingas automobilio ID" });
    }

    const car = await Automobilis.findById(id);
    console.log(car);
    
    if (!car) return res.status(404).json({ error: "Automobilis nerastas" });

    res.json(car); // grąžina pilną objektą
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serverio klaida" });
  }
});
// POST - sukurti naują automobilį
// router.post('/', controller.createAutomobilis)
// Accept multiple images uploaded from the client under field name "images"
router.post('/', requireAuth, 
  upload.array('images', 6),
  (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to add listings' });
  }
  next();
}, controller.createAutomobilis);
//PATCH - redaguoti vieną automobilį
router.patch('/:id', controller.updateAutomobilis)
//DELETE - ištrinti vieną automobilį
router.delete('/:id', controller.deleteAutomobilis)

//top auto
router.get('/top', controller.getTopAutomobiliai)



export default router