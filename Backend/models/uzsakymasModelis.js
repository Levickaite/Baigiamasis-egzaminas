import mongoose from "mongoose";

const uzsakymasSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prekes: [{
        automobilis: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Automobilis',
            required: true
        },
        kiekis: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        }
    }],
    visoMoketi: {
        type: Number,
        required: true,
        default: 0
    },
    statusas: {
        type: String,
        default: 'Laukiama apmokėjimo'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Uzsakymas', uzsakymasSchema);