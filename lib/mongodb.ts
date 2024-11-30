import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Declare a global type for caching
declare global {
  var mongoose: { conn: Connection | null; promise: Promise<Connection> | null };
}

// Initialize cached connection in the global scope
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<Connection> {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new MongoDB connection...");
    cached.promise = mongoose
      .connect(MONGODB_URI as string)
      .then((connection) => connection.connection) // Extract `connection` from the promise
      .catch((err) => {
        console.error("MongoDB Connection Error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  console.log("MongoDB connection established");
  return cached.conn;
}
