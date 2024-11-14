import express from 'express'
import dotenv from 'dotenv';
dotenv.config()
import {connectDb} from './config/database.js'

const port = process.env.PORT || 5000
const app = express();

connectDb()

app.get('/',(req,res)=>{
    res.send("Server is connected ")
})

app.listen(port,(req,res)=>{
    console.log(`Server running on ${port}`)
})