import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "e-commerce-api",
    });
    console.log(`Database Connected to ${mongoose.connection.host}`);
    console.log(`dbName: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
