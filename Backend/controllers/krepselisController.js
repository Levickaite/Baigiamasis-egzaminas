import Krepselis from '../models/krepselisModelis.js'
import Automobilis from '../models/autoModelis.js'

export const getCart = async (req, res) => {
    try {
        const cart = await Krepselis.findOne({ user: req.user._id }).populate('prekes.automobilis');
        if (!cart) return res.json({ prekes: [], visoMoketi: 0 });
        if(cart){
            cart.prekes = cart.prekes.filter(item => item.automobilis);
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const addToCart = async (req, res) => {
    const { automobilisId, kiekis } = req.body;
    const userId = req.user._id;
    console.log('addToCart called by user:', userId, 'body:', req.body);
    try {
        const automobilis = await Automobilis.findById(automobilisId);
        if (!automobilis) {
            return res.status(404).json({ error: 'Automobilis nerastas' });
        }
        // prevent adding if car is reserved or sold
        if (automobilis.rezervuotas) {
            return res.status(400).json({ error: 'Automobilis jau rezervuotas' });
        }
        if (automobilis.parduotas) {
            return res.status(400).json({ error: 'Automobilis jau parduotas' });
        }
        let cart = await Krepselis.findOne({ user: userId });
        if (!cart) {
            cart = new Krepselis({ user: userId, prekes: [], visoMoketi: 0 });
        }

        // sanitize any invalid items (old data might contain { automobilis: null })
        const beforeLen = cart.prekes.length;
        cart.prekes = cart.prekes.filter(item => item && item.automobilis);
        if (cart.prekes.length !== beforeLen) {
            console.log('Removed invalid prekes entries from cart for user', userId);
        }

        const qty = Number(kiekis) || 1;

        // safe id comparison (handles ObjectId, string or populated object)
        const existingItem = cart.prekes.find(item => {
            if (!item || !item.automobilis) return false;
            const itemId = item.automobilis._id ? String(item.automobilis._id) : String(item.automobilis);
            return itemId === String(automobilisId);
        });

        if (existingItem) {
            existingItem.kiekis = (existingItem.kiekis || 0) + qty;
        } else {
            const idToPush = automobilis && automobilis._id ? automobilis._id : automobilisId;
            console.log('Pushing to cart.prekes automobilis id:', idToPush);
            cart.prekes.push({ automobilis: idToPush, kiekis: qty });
        }

        // populate to ensure automobilis.price available when recalculating total
        await cart.populate('prekes.automobilis');
        cart.visoMoketi = cart.prekes.reduce((sum, item) => {
            const price = item.automobilis ? (item.automobilis.price || 0) : 0;
            const k = item.kiekis || 0;
            return sum + price * k;
        }, 0);

    console.log('cart.prekes before save:', cart.prekes);
    await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('addToCart error:', error);
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
        const itemIndex = cart.prekes.findIndex(item => {
            if (!item || !item.automobilis) return false;
            const itemId = item.automobilis._id ? String(item.automobilis._id) : String(item.automobilis);
            return itemId === String(automobilisId);
        });
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Prekė nerasta krepšelyje' });
        }

        // populate to compute accurate price
        await cart.populate('prekes.automobilis');
        const car = cart.prekes[itemIndex].automobilis;
        const itemKiekis = cart.prekes[itemIndex].kiekis || 0;
        const price = car ? (car.price || 0) : 0;
        cart.prekes.splice(itemIndex, 1);
        cart.visoMoketi = cart.prekes.reduce((sum, item) => {
            const p = item.automobilis ? (item.automobilis.price || 0) : 0;
            return sum + p * (item.kiekis || 0);
        }, 0);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
