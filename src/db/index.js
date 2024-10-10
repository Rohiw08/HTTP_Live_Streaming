import { DB_NAME } from '../constants.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
const app = express();

dotenv.config({path : '.env'});

// const port = process.env.PORT || 8000;

const connectDB = async () => {
    console.log(process.env.MONGODB_URI);
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