require('dotenv').config();
const mongoose = require('mongoose');

// Vercel par function baar baar chal sakta hai, is liye connection ek baar bana kar yaad rakhte hain (cache).
// Ghalti ho to yahan se throw hota hai, server band karne ka faisla bahar wala karta hai.
let connecting = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB connected successfully'))
      .catch((error) => {
        connecting = null;
        throw error;
      });
  }

  await connecting;
};

module.exports = connectDB;
