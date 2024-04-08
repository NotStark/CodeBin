import mongoose from "mongoose";
import config from "../config/config";

export default async function connectDb() {
    try {
        const DB = await mongoose.connect(config.MONGODB_URI, {
            dbName: config.DB_NAME,
        });
        console.log(`MongoDB connected || DB HOST: ${DB.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1)
    }
};


