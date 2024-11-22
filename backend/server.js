import express, { json } from 'express'
import dotenv from 'dotenv';
dotenv.config()
import {connectDb} from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const port = process.env.PORT || 5000
const app = express();

connectDb()

app.use(json())
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/api/user/', authRoutes);
app.use('/api/admin/', adminRoutes);


app.listen(port,(req,res)=>{
    console.log(`Server running on ${port}`)
})