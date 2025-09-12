import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
     username:{

      type:String,
      required:true,
      unique:true,
      lowerCase :true,
      trim: true,
      index: true      //! It is used for searching and optimisng it 

     },

      email:{
      type:String,
      required:true,
      unique:true,
      lowerCase :true,
      trim: true, 
     },

     fullname:{
      type:String,
      required:true,
      trim:true,
      index:true
     },

     avatar:{
      type: String,    //! cloudinary Url
      required: true,


     },
     coverImage:{
      type:String,
     },

     watchHistory:[
      {
        type:Schema.Types.ObjectId,
        ref:'Video',
      }
    ],
    password:{
      type:String,
       required: [true, 'Password is required'],  //!  Format to send Custom error meassage , we can send

    },
    refreshToken:{
      type:String
    }

  },
{
  timestamps: true
})


//? save is a type of middleware

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next()         //! if password is not modified then return next()

  this.password = await bcrypt.hash(this.password, 10)
  next()

})
//! custom way  to create custom function using methods object
userSchema.methods.isPasswordCorrect = async function(password){

  return await bcrypt.compare(password, this.password)

}

userSchema.methods.generatAccessToken = function(){

 return  jwt.sign(
    {
      _id:this._id,
      username:this.username,
      email:this.email,
      fullname:this.fullname,

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )

}


userSchema.methods.generateRefreshToken = function(){
  
 return  jwt.sign(
    {
      _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )

}


export const User = mongoose.model('User', userSchema)