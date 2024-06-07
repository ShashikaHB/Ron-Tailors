import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`Mongo DB connected ${mongoose.connection.host}` .bgCyan.black);
  } catch (error) {
    console.log(`Mongo DB error ${error}`.bgRed.white);
  }
};


export default connectDB