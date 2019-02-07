import dotenv   from 'dotenv';
import mongoose from "mongoose";

dotenv.load();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
    .then(() => console.log("Mongoose connected..."));