import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadToCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'

const generateAccessandRefreshToken = async(userId)=>{

  try{
  const user = await User.findById(userId)
    const accessToken = user.generatAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});
    return {accessToken, refreshToken}


  }catch(error){
    console.log('sdfg',error);
    
    throw new ApiError(500, 'Something went wrong while generating access or refresh token')
  }


}

const registerUser = asyncHandler(async(req, res)=>{

         // get user details from frontend
         // validations - like not empty, correct format  etc
         // check if user already exist : through username or email
         // check for images , avatar 
         // upload them to cloudinary, avatar
         // create user object - creaate entry in db
         // remove password and refresh token field from response 
         // check for user creation 
         // return response

        const {fullName, email, username, password} = req.body
        console.log('email', email);
        // if(fullname===''){
        //   throw new ApiError(400, 'Fullname is required')
        // }

        if(
          [fullName,email,username,password].some((field)=>{
            field?.trim()===''})
        ){
          console.log('qwert');
          
          throw new ApiError.json(400, 'All fields are required')
        }

       const existedUser = await  User.findOne({
          $or: [{username},{email}]
        })
        if(existedUser){
          throw new ApiError(409, 'User with email or username already exist')
        }
          //! files by multer 

        const avatarLocalPath = req.files?.avatar[0]?.path;
        // const coverImageLocalPath = req.files?.coverImage[0]?.path;

        let coverImageLocalPath;
            if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path;   
            }

        if(!avatarLocalPath){
          throw new ApiError(400, 'avatar is required')
        }

       const avatar= await uploadToCloudinary(avatarLocalPath)
       console.log('avatar url', avatar);
       
       const coverImage = await uploadToCloudinary(coverImageLocalPath)

       if(!avatar){
        throw new ApiError(400, 'Avatar upload failed')
       }
    
      const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url ||'',
        email,
        username:username.toLowerCase(),
        password,
      
       })
       const createdUser = await User.findById(user._id).select(
         '-password -refreshToken'
       )

       if(!createdUser){
        throw new ApiError(500, 'Something went wrong while registering the user')
       }
       return res.status(201).json(
        new ApiResponse(200, createdUser, 'user registered successfully'  
        )
       )

})

const loginUser =asyncHandler(async(req,res)=>{

   // get data from req body
   // username or email , password 
   // find the user
   // if not found send error
   // password checked
   // generate access and refresh token 
   // send in cookies  and send response

   const{username, email ,password} = req.body;
   if(!(username || email)){                //! logging with both either username or email 
    throw new ApiError(400, 'Username or email is required')
   }

  const user = await User.findOne({
    // email
    $or:[{username},{email}]           //! or is the mongodb operator used to find either username or email in db

   })

   if(!user){
    throw new ApiError(404, 'User not found')
   }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if(!isPasswordValid){
    throw new ApiError(401, 'Invalid user credentials')
   }

  const {accessToken, refreshToken}=  await  generateAccessandRefreshToken(user._id)

  const loggedInUser =  await User.findById(user._id).       //! this is optional , we can also use user directly
          select('-password -refreshToken')

            //! by httpOnly: true and secure : true it cannot be modified by frontend only by server
      const options = {      
            httpOnly:true,   
            secure:true,
          }

          return res.status(200).cookie("accessToken", accessToken, options)
          .cookie("refrehToken", refreshToken, options)
          .json(
            new ApiResponse(200, {user:loggedInUser, accessToken ,refreshToken}, 'User logged in successfully') //!   we are sending access and refresh token in response maybe user wants to save this token in local storage or anywhere purpose , its a good practice also in mobile app we cannot set cookies
          )
      
})

const logOutuser = asyncHandler(async(req,res)=>{
     
 await  User.findByIdAndUpdate(req.user._id, 
    {
      $set:{refreshToken:''}   //! we are clearing refresh token from db
    },
    {
        new :true,
    }
  )

   const options = {      
            httpOnly:true,   
            secure:true,
          }
     return res.status(200)  //! maxAge:0 means cookie will expire immediately     
           .clearCookie('accessToken',options)
      .clearCookie('refreshToken',options) //! clearCookie is used to clear cookie from browser from cookies-parser package
           .json(
            new ApiResponse(200, {}, 'User logged out successfully')
           )
})


const refreshAccessToken= asyncHandler(async (req,res)=>{
const incomingRefreshToken =   req.cookies.refreshToken || req.body.refreshToken  //? req.body because of mobile 

  if(!incomingRefreshToken){
    throw new ApiError(401, 'Unauthorized request');
  }
  
 try{
  const decodedToken =  jwt.verify(
    incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET
  )
 const user =await User.findById(decodedToken?._id);

 if(!user){
   throw new ApiError(401, 'Invalid refresh token')
 }
 if(incomingRefreshToken!==user?.refreshToken){
   throw new ApiError(401, 'Refresh token is expired')

 }
 const options ={
  httpOnly: true,
  secure:true
 }
const {accessToken, newrefreshToken}=  await generateAccessandRefreshToken(user._id)

 return res.status(200)
 .cookie("accessToken" , accessToken, options)
 .cookie("refreshToken", newrefreshToken, options)
 .json(
  new ApiResponse(
    {

      accessToken,
      refreshToken:newrefreshToken
    },
    "Access token refreshed"
  )
 )
 }


 catch(error){

   throw new ApiError(401, error?.message || 'Invalid refresh token')
 }

})


export {registerUser, loginUser, logOutuser ,refreshAccessToken}