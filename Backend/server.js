import dotenv from 'dotenv'
import express from 'express'
import masinosRoutes from './routes/masinos.js'
import mongoose from 'mongoose'
import userRoutes from './routes/user.js'
import krepselisRoutes from './routes/krepselisRoutes.js'
import uzsakymasRoutes from './routes/uzsakymasRoutes.js'
import cors from 'cors'

dotenv.config({ path: './.env' });


//express app
const app =express()
app.use(cors({ origin: process.env.CORS || '*' }));
//middleware
app.use(express.json())
app.use((req, res, next)=> {
    console.log(req.path, req.method)
    next()
    
})
//routes 

app.use('/api/Autonamai/automobiliai', masinosRoutes)
app.use('/api/Autonamai/useriai', userRoutes)
app.get('/',(req, res)=>{
    res.json({mssg: 'Welcome to the app!'})
} )

app.use('/api/Autonamai/krepselis', krepselisRoutes);
app.use('/api/Autonamai/uzsakymas', uzsakymasRoutes);

//connect to DB
mongoose.connect(process.env.URI)
    .then(()=>{
        app.listen(process.env.PORT, ()=>{
            console.log('listening on port', process.env.PORT);
            
        })
    })
    .catch((err)=> console.log(err)
    )




