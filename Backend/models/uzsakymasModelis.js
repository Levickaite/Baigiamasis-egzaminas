import mongoose from "mongoose";

const uzsakymasSchema = new mongoose.Schema ({
    photo: {
        type: String, // čia bus cloudinary URL
        required: true,
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
    
    year:{
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    }, }, { timestamps: true}
    

);

export default mongoose.model('Uzsakymas', uzsakymasSchema);