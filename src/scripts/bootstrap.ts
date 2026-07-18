import path from "node:path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

console.log("✅ Environment Loaded");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Loaded" : "Not Loaded");