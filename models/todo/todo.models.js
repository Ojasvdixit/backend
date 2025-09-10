import mongoose from "mongoose";



const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  complete:{
    type :Boolean, 
     default:false,
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,  
    ref: "User",  //! reference to User model  ,  name given inside model function
  },

  subTodos:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubToDo",
    }

  ]


},
{timestamps:true}  

)
export const Todo = mongoose.model("Todo", todoSchema);