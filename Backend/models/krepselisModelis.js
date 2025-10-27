import mongoose from "mongoose";

const KrepselisSchema = new mongoose.Schema({
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
    }
}, { timestamps: true });

export default mongoose.model('Krepselis', KrepselisSchema);