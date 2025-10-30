import express from 'express'
import * as controller from '../controllers/controllers.js'

//cloud
import requireAuth from '../middleware/requireAuth.js'
// use multer/cloudinary uploader from middleware
import { upload } from '../middleware/upload.js';



const router = express.Router()
// router.use()
//GET - paimti visus automobilius
router.get('/', controller.getAutomobilis)
//GET - ppaimti vieną automobilį 
router.get('/:id', (req, res)=>{
    res.json({mssg: 'GET vieną automobilį'})
})
// POST - sukurti naują automobilį
// router.post('/', controller.createAutomobilis)
// Accept multiple images uploaded from the client under field name "images"
router.post('/', requireAuth, 
  upload.array('images', 6),
  (req, res, next) => {
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ message: 'Not authorized to add listings' });
  // }
  next();
}, controller.createAutomobilis);
//PATCH - redaguoti vieną automobilį
router.patch('/:id', controller.updateAutomobilis)
//DELETE - ištrinti vieną automobilį
router.delete('/:id', controller.deleteAutomobilis)

//top auto
router.get('/top', controller.getTopAutomobiliai)



export default router