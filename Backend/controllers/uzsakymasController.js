import Uzsakymas from '../models/uzsakymasModelis.js'
import Krepselis from '../models/krepselisModelis.js'
import Automobilis from '../models/autoModelis.js'

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const userEmail = req.user.email;
        const cart = await Krepselis.findOne({ user: userId }).populate('prekes.automobilis');
        if (!cart || cart.prekes.length === 0) {
            return res.status(400).json({ error: 'Krepšelis yra tuščias' });
        }

        // For each item in the cart, create a separate order with the required attributes
        const createdOrders = [];
        for (const item of cart.prekes) {
            const automobilis = item.automobilis;
            if (!automobilis) continue; // safety check
            const newOrder = new Uzsakymas({
                photo: automobilis.photo,
                model: automobilis.model,
                price: automobilis.price,
                color: automobilis.color,
                year: automobilis.year,
                email: userEmail,
                status: 'Nepatvirtinta',
                automobilis: automobilis._id
            });
            await newOrder.save();
            createdOrders.push(newOrder);

            // mark the car as reserved when an order is created
            try {
                await Automobilis.findByIdAndUpdate(automobilis._id, { rezervuotas: true, parduotas: false });
            } catch (e) {
                console.warn('Warning: failed to mark automobilis as rezervuotas', automobilis._id, e.message);
            }
        }
        if (createdOrders.length === 0) {
            return res.status(400).json({ error: 'Krepšelyje nėra galimų užsakymų' });
        }
        // Clear the cart
        cart.prekes = cart.prekes.filter(item => !item.automobilis);
        cart.visoMoketi = cart.prekes.reduce((sum, item) => sum + (item.automobilis?.price || 0) * item.kiekis, 0);
        await cart.save();

        res.status(201).json({ message: 'Užsakymas sėkmingai sukurtas', orders: createdOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Return orders. If requester is a regular user, return only their orders (by email).
export const getUzsakymas = async (req, res)=>{
    try {
        
        const requester = req.user;
        if (!requester) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { notStatus, email: queryEmail } = req.query;

        // Build base query
        let query = {};

        if (requester.role === 'user') {
            // Regular users may only see their own orders
            query.email = requester.email;
        } else if (requester.role === 'admin') {
            // Admin may optionally filter by email (query param) or exclude a status
            if (queryEmail) query.email = queryEmail;
            if (notStatus) query.status = { $ne: notStatus };
        }

        const uzsakymai = await Uzsakymas.find(query).sort({ createdAt: -1 });
        res.status(200).json(uzsakymai);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};