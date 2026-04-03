import mongoose from "mongoose";

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

export default connectDB;
