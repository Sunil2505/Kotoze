import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

console.log("DNS Servers:", dns.getServers());



import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

console.log(
  "URI:",
  process.env.MONGODB_URI?.replace(/\/\/.*:.*@/, "//***:***@")
);



  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB Error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}