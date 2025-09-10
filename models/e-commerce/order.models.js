import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product',
  },
  quantiy:{
    type:Number,
    required:true
  }
})

const orderSchema = new mongoose.Schema({

  oderPrice:{
    type:Number,
    required:true
  },
  customer:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
  },
  orderItems:{
    type:[orderItemSchema],
  },

  address:{
    type:String,
    required:true
  },

  status:{
    type:String,
    enum:['pending','completed','cancelled'],   //! enum means choices , so status can only be one of these three
    default:'pending'
    }

},{
  timestamps:true
})

export const Order = mongoose.model("Order", orderSchema);