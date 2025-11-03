import express from 'express';
import { loginUser, signupUser} from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js'
const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ error: "Vartotojas nerastas" });
    res.json({ role: req.user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serverio klaida" });
  }
});
//login route
router.post('/login', loginUser)
//signup route
router.post('/signup', signupUser)
// //get goal
// router.get('/goal', requireAuth, getGoal)
// //update goal
// router.put('/goal', requireAuth, updateGoal)
export default router