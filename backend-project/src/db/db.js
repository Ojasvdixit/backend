import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try{
    const connectionInstance =   await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`Mongodb connected on DB host : ${connectionInstance.connection.host}`);

  }catch(err){
    console.error('Mongodb connection failed',err);
    process.exit(1);           //! process-> it is the refrenced on which process is  running
  }
}

export default connectDB;
