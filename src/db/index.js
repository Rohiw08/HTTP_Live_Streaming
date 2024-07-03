import { DB_NAME } from '../constants.js';
import 'dotenv/config'
import mongoose from'mongoose';
import express from 'express';
const app = express();

// const port = process.env.PORT || 5000;
console.log(process.env.MONGODB_URI);
const connectDB = async () => {
    
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on('error', err => console.log(err));
        console.log(connectionInstance.connection.host);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDB;