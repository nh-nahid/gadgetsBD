import mongoose from "mongoose";

export async function dbConnect() {
  try {
    if (mongoose.connection.readyState >= 1) return; // already connected

    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
