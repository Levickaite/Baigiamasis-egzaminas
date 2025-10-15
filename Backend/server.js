import dotenv from 'dotenv'
import express from 'express'
// import pratimaiRoutes from './routes/pratimai.js'
import mongoose from 'mongoose'
import userRoutes from './routes/user.js'

dotenv.config({ path: './Backend/.env' });


//express app
const app =express()
//middleware
app.use(express.json())
app.use((req, res, next)=> {
    console.log(req.path, req.method)
    next()
    
})
//routes 

// app.use('/api/pratimai', pratimaiRoutes)
app.use('/api/Autonamai/useriai', userRoutes)
app.get('/',(req, res)=>{
    res.json({mssg: 'Welcome to the app!'})
} )

//connect to DB
mongoose.connect(process.env.URI)
    .then(()=>{
        app.listen(process.env.PORT, ()=>{
            console.log('listening on port', process.env.PORT);
            
        })
    })
    .catch((err)=> console.log(err)
    )




