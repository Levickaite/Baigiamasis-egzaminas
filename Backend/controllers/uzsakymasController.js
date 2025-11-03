import Uzsakymas from '../models/uzsakymasModelis.js'
import Krepselis from '../models/krepselisModelis.js'

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
            const newOrder = new Uzsakymas({
                photo: automobilis.photo,
                model: automobilis.model,
                price: automobilis.price,
                color: automobilis.color,
                year: automobilis.year,
                email: userEmail,
                status: 'Laukiama apmokėjimo'
            });
            await newOrder.save();
            createdOrders.push(newOrder);
        }

        // Clear the cart
        cart.prekes = [];
        cart.visoMoketi = 0;
        await cart.save();

        res.status(201).json({ message: 'Užsakymas sėkmingai sukurtas', orders: createdOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
