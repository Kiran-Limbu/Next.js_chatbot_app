import mongoose from "mongoose";

const db_url = process.env.DB_URL as string;
export default async function connectDB() {
    try {
        await mongoose.connect(db_url);
    } catch (error) {
        console.error(error);
    }
}