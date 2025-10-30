import Automobilis from '../models/autoModelis.js'
import mongoose from 'mongoose'

// GET - paimti visus automobilius
export const getAutomobilis = async (req, res)=>{
// const user_id = req.user._id
try {
    const masinos = await Automobilis.find({}).sort({ createdAt: -1 });
    res.status(200).json(masinos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
} // isimta user.id - nelogiska kad matyti auto 
//POST - sukurti naują automobilį
export const createAutomobilis = async (req, res)=>{
const { model, price, color, engine, year, gearBox, fuelType, power} = req.body
// When using upload.array('images'), multer stores files in req.files (array).
// Use the first uploaded image as the primary `photo` to match the model schema.
const photo = (req.files && req.files.length) ? req.files[0].path : null;

let emptyFields=[]
// if(!photo) {emptyFields.push('photo')}
if(!model) {emptyFields.push('model')}
if(!price) {emptyFields.push('price')}
if(!color) {emptyFields.push('color')}
if(!engine) {emptyFields.push('engine')}
if(!year) {emptyFields.push('year')}
if(!gearBox) {emptyFields.push('gearBox')}
if(!fuelType) {emptyFields.push('fuelType')}
if(!power) {emptyFields.push('power')}
if (emptyFields.length > 0){
return res.status(400).json({error: 'Prašome užpildyti visus laukelius', emptyFields})
}
try {
const user_id = req.user._id
const masina = await Automobilis.create({photo, model, price, color, engine, year, gearBox, fuelType, power, user: user_id})
res.status(200).json(masina)
}catch(error){
res.status(400).json({error: error.message})
}
}

//PATCH - redaguoti vieną automobilį
export const updateAutomobilis = async (req, res)=> {
const {id} = req.params
if(!mongoose.Types.ObjectId.isValid(id)){
return res.status(404).json({error: 'Tokio automobilio nėra.'})
}
const masina = await Automobilis.findOneAndUpdate({_id: id}, {...req.body}, {new: true})
if(!masina){
return res.status(404).json({error: 'Tokio automobilio nėra.'})
}
res.status(200).json(masina)
}

//DELETE - ištrinti vieną automobilį
export const deleteAutomobilis = async (req, res)=>{
const {id} = req.params
if(!mongoose.Types.ObjectId.isValid(id)){
return res.status(404).json({error: 'Tokio automobilio nėra'})
}
const masina = await Automobilis.findOneAndDelete({_id: id})
if(!masina){
return res.status(404).json({error: 'Tokio automobilio nėra'})
}
res.status(200).json(masina)

}

export const getTopAutomobiliai = async (req, res) => {
    try {
        const topCars = await Automobilis.find({}).sort({ traffic: -1 }).limit(5);
        res.status(200).json(topCars);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
//top auto filtravimas pagal traffica