import mongoose from "mongoose";

//! Data modelling in mongodb using mongoose

const userSchema = new mongoose.Schema(
  {

    // username:String,  //! this is the simple way to define schema
    // email:String,
    // password:String,

    username :{
        type:String,
        required:true,  //! if we do not give required true then it will not save in db 
        unique:true,
        lowercase:true, 
    }, 

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:[true, "Password is required"],  //! this is the way to give custom error message
    },

},
  { timestamps: true }  //! it will create createdAt and updatedAt fields automatically)

)

//! Mongoose will look for a collection named 'users' in your MongoDB database, it convert automatically the first letter to lowercase and add an 's' at the end
//? For example, if you use mongoose.model('Todo', todoSchema), 


//? it is a convention to export schema  singular and model in plural
export const user = mongoose.model("User", userSchema);