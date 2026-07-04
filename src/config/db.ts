import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
