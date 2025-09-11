import mongoose , {Schema} from "mongoose";

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



export const User = mongoose.model('User', userSchema)