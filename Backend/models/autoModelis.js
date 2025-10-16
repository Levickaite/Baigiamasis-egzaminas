import mongoose from "mongoose";
import bcrypt from 'bcrypt'
// import validator from 'validator'

const Schema = mongoose.Schema
const automobilisSchema = new Schema ({
    // photo: {
    //     data: Buffer,
    //     contentType: String,
    //     required: true,
    // },

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
    power:{
        type: Number,
        required: true
    },

})

// userSchema.statics.signup = async function (email, password){
//     //validavimas
//     if(!email || !password){
//         throw Error ('Visi laukeliai privalomi.')
//     }
//     if(!validator.isEmail(email)){
//         throw Error('El. paštas nėra tinkamas.')
//     }
//     if(!validator.isStrongPassword(password)){
//         throw Error('Slaptažodis pernelyg silpnas.')
//     }
//     const exists = await this.findOne({email})
//     if(exists){
//         throw Error ('El.paštas jau naudojamas')
//     }
//     const salt = await bcrypt.genSalt(10)
//     const hash = await bcrypt.hash(password, salt)
//     const user = await this.create({email, password: hash})
//     return user
// }

// //statiškas login metodas
// userSchema.statics.login = async function(email, password){
//     if(!email || !password){
//         throw Error ('Visi laukeliai privalomi.')
//     }
//     const user = await this.findOne({email})
//     if(!user){
//         throw Error('El. paštas neteisingas.')
//     }
//     const match =  await bcrypt.compare(password, user.password)
//     if(!match){
//         throw Error('Neteisingas slaptažodis.')
//     }
//     return user
// }

export default mongoose.model('Automobilis', automobilisSchema)
