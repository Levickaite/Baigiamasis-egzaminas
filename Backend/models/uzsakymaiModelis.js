import mongoose from "mongoose";
import bcrypt from 'bcrypt'
// import validator from 'validator'

const Schema = mongoose.Schema
const userSchema = new Schema ({
    photo: {
        data: Buffer,
        contentType: String,
        required: true,
    },

    model: {
        type: String,
        rerquired: true
    },
    price: {
        type: Number,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    
    year:{
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    status:{
        type: String,
        required: true
    }
    

})
