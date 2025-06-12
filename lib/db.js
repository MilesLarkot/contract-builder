// import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) throw new Error("MONGO_URI not set");

// let cached = global.mongoose || { conn: null };

// export async function connectDB() {
//   if (cached.conn) return cached.conn;

//   cached.conn = await mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   return cached.conn;
// }
