import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const dbUri = `${process.env.MONGO_DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(`${process.env.MONGO_DB_URL}/uat`, );
    console.log(`Mongo DB connected ${mongoose.connection.host}`.bgCyan.black);
  } catch (error) {
    console.log(`Mongo DB error ${error}`.bgRed.white);
  }
};

export default connectDB;
 