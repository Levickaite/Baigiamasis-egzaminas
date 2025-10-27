import Krepselis from '../models/krepselisModelis.js'
import Automobilis from '../models/autoModelis.js'

export const getCart = async (req, res) => {
    try {
        const cart = await Krepselis.findOne({ user: req.user._id }).populate('prekes.automobilis');
        if (!cart) return res.json({ prekes: [], visoMoketi: 0 });
        res.json(cart);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const addToCart = async (req, res) => {
    const { automobilisId, kiekis } = req.body;
    const userId = req.user._id;
    try {
        const automobilis = await Automobilis.findById(automobilisId);
        if (!automobilis) {
            return res.status(404).json({ error: 'Automobilis nerastas' });
        }
        let cart = await Krepselis.findOne({ user: userId });
        if (!cart) {
            cart = new Krepselis({ user: userId, prekes: [], visoMoketi: 0 });
        }
        const existingItem = cart.prekes.find(item => item.automobilis.toString() === automobilisId);
        if (existingItem) {
            existingItem.kiekis += kiekis; // kaiautomobiliai, tai  gal galima by default  dėt 1, nes listinguose kaip ir nedėjom kiekio pasirinkimo į krepšelį?
        } else {
            cart.prekes.push({ automobilis: automobilisId, kiekis });
        }

        cart.visoMoketi += automobilis.price * kiekis;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

export const removeFromCart = async (req, res) => {
    const { automobilisId } = req.body;
    const userId = req.user._id;
    try {
        const cart = await Krepselis.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Krepšelis nerastas' });
        }
        const itemIndex = cart.prekes.findIndex(item => item.automobilis.toString() === automobilisId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Prekė nerasta krepšelyje' });
        }
        const car = await Automobilis.findById(automobilisId);
        cart.visoMoketi -= car.price * cart.prekes[itemIndex].kiekis;
        cart.prekes.splice(itemIndex, 1);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
