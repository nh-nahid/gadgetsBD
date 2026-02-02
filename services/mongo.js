// lib/dbConnect.js
import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, 
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_CONNECTION_STRING, opts)
      .then((mongoose) => mongoose);
      
      console.log("MongoDB connected");
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
