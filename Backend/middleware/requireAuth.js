import jwt from 'jsonwebtoken'
import User from '../models/userModelis.js'
const requireAuth = async (req, res, next) =>{
    //patikriname ar user autentikuotas
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: 'Autorizavimo token yra privalomas.'})
    }
    const token = authorization.split(' ')[1]
    try{
        const {_id} = jwt.verify(token, process.env.SECRET)
        req.user = await User.findOne({ _id }).select('_id role email');

    if (!req.user) {
      return res.status(401).json({ error: 'Naudotojas nerastas.' });
    }

    next();
    }catch(error){
        console.log(error);
        res.status(401).json({error: 'Užklausa nepatvirtinta.'})
        
    }
}
export default requireAuth