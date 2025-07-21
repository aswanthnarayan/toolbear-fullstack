import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

const mongoURL = process.env.MONGO_URL;
const dbName = "toolbear";

export async function connectDb() {
    try {
        await mongoose.connect(mongoURL, {
            retryWrites: true,
            w: "majority",
            tls: true,
            tlsAllowInvalidCertificates: true
        });
        console.log("Connection successful");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
