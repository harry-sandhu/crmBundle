import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      // Options are not always needed in latest mongoose (>6.x)
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connect error:", err);
    process.exit(1);
  }
};

export default connectDB;
