import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js";
export const verifyJWT = asyncHandler(async (req, _, next) => { //! we can write _ instead of res if we are not using it
   
  try{
 const token =  req.cookies?.accessToken  || req.header('Authorization')?.replace('Bearer ', '')

  if(!token){
    throw new ApiError(401, 'Unautohrized request')
  }
  const decodedToeken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToeken._id).select('-password -refreshToken');
  if(!user){
    throw new ApiError(401, 'Invalid access token')
  }

  req.user = user;   //! attaching user to req object so that we can access it in next middlewares or controllers
  next()

  }
catch(error){
  if(error.name === 'TokenExpiredError'){
    throw new ApiError(401, error?.message || 'Invalid access token')
  }
}
})
