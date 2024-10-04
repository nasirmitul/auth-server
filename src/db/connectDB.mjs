import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // console.log("mongo uri", process.env.MONGO_URI);
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`)
  } catch (error) {
    console.log("Error connecting to Mongo", error);
    process.exit(1); // 1 is failure, status code 0 is success
  }
}