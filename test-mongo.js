require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

console.log(uri ? "✅ URI Loaded" : "❌ URI Missing");

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:");
    console.error(err);
    process.exit(1);
  });