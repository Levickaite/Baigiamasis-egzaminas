import User from '../models/userModelis.js'
import jwt from 'jsonwebtoken'

const createToken= (_id)=>{
return jwt.sign({_id }, process.env.SECRET, {expiresIn: '3d'})
}

//login user
export const loginUser = async (req, res)=>{
const {email, password} = req.body
try{
const user = await User.login(email, password)
const token = createToken(user._id)
res.status(200).json({email, token, role: user.role})
} catch (error){
res.status(400).json({error: error.message})
}
}

//signup user
export const signupUser = async (req, res)=>{
const {name, lastname, email, password, role} = req.body
try {
const user = await User.signup(name, lastname, email, password, role || 'user')
const token = createToken(user._id)
res.status(200).json({email, token, role: user.role})
} catch (error) {
res.status(400).json({error: error.message})
}

}

