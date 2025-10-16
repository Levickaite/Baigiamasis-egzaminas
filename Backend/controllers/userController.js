import User from '../models/userModelis.js'
import jwt from 'jsonwebtoken'

const createToken= (_id)=>{
return jwt.sign({id: user._id, role: user.role }, process.env.SECRET, {expiresIn: '3d'})
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
const {name, lastname, email, password} = req.body
try {
const user = await User.signup({name,lastname, email, password, role: role || 'user'})
const token = createToken(user._id)
res.status(200).json({email, token, role: user.role})
} catch (error) {
res.status(400).json({error: error.message})
}

}

// //get goal
// export const getGoal = async (req, res) => {
// const user_id = req.user._id
// try {
// const user = await User.findById(user_id)
// if (!user) {
// return res.status(404).json({ error: 'User not found' })
// }
// res.status(200).json({ goal: user.goal })
// } catch (error) {
// res.status(400).json({ error: error.message })
// }
// }

// //update goal
// export const updateGoal = async (req, res) => {
// const user_id = req.user._id
// const { goal } = req.body
// try {
// const user = await User.findByIdAndUpdate(user_id, { goal }, { new: true })
// if (!user) {
// return res.status(404).json({ error: 'User not found' })
// }
// res.status(200).json({ goal: user.goal })
// } catch (error) {
// res.status(400).json({ error: error.message })
// }
// }