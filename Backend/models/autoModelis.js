import mongoose from "mongoose";
import bcrypt from 'bcrypt'


const Schema = mongoose.Schema
const automobilisSchema = new Schema ({

    photo: {
        type: String, 
        required: true
    },
    model: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    engine:{
        type: Number,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    gearBox:{
        type: String,
        required: true
    },
    fuelType:{
        type: String,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    traffic: {
        type: Number,
        default: 0
    },
    parduotas: {
        type: Boolean,
        default: false
    },
    rezervuotas: {
        type: Boolean,
        default: false
    },


})



export default mongoose.model('Automobilis', automobilisSchema)
