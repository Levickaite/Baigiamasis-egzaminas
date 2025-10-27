import Uzsakymas from '../models/uzsakymasModelis.js'
import Krepselis from '../models/krepselisModelis.js'

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Krepselis.findOne({ user: userId }).populate('prekes.automobilis');
        if (!cart || cart.prekes.length === 0) {
            return res.status(400).json({ error: 'Krepšelis yra tuščias' });
        }

        const visaSuma = cart.visoMoketi;

        const newOrder = new Uzsakymas({
            user: userId,
            prekes: cart.prekes.map(item => ({
                automobilis: item.automobilis._id,
                kiekis: item.kiekis
            })),
            visoMoketi: visaSuma,
            statusas: 'Laukiama apmokėjimo'
        });

        await newOrder.save();

        cart.prekes = [];
        cart.visoMoketi = 0;
        await cart.save();

        res.status(201).json({ message: 'Užsakymas sėkmingai sukurtas', order: newOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};