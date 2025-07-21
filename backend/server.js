import express, { json } from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';  
dotenv.config()
import {connectDb} from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cors from 'cors';


const port = process.env.PORT || 5000
const app = express();

connectDb()

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000','https://toolbear-fullstack.onrender.com','https://toolbear.shop','https://toolbear-fullstack-1.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));


app.use(json())
app.use(express.json());
app.use(cookieParser());  
app.use(express.urlencoded({ extended: true })); 
app.use('/api/user/', authRoutes);
app.use('/api/admin/', adminRoutes);
app.use('/api/user/', userRoutes);

app.listen(port,()=>{
    console.log(`Server running on ${port}`)
})