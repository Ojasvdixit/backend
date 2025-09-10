import mongoose from "mongoose";
import { Category } from "./category.models";

const productSchema = new mongoose.Schema({

  description: {
    required: true,
    type: String,
  }, 
  
  name: {
    required: true,
    type: String,
  }, 

  productImage:{  //? images we store on services like cloudinary, so it we do not store in db it could increase size of db
    type: String,

  },
  price:{
    type:Number,
    default:0
  },
  stock:{
     type:Number,
    default:0
  },
    category:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Category',
      required:true
    }
    ,
    owner:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
    }
},{
  timestamps:true
})

export const Product = mongoose.model("Product", productSchema);