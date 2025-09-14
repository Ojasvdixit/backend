
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'   //! fs stands for file system  in nodejs is used  to read, write , edit etc file all operations


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:true
})

console.log("Cloudinary config:", cloudinary.config());


const uploadToCloudinary = async (localfilePath) => {

  try {
    if(!localfilePath){
      return null
      }

     const response = await cloudinary.uploader.upload(localfilePath,{
        resource_type:'auto',   //! it will detect the type of file whether its image or video
      })
      console.log('File is uploaded to cloudinary', response?.url);
      fs.unlinkSync(localfilePath)  //! it will delete the file from local system after uploading to cloudinary

    return response;

}catch(error){
    fs.unlinkSync(localfilePath)  //! it will delete the file from local system after uploading gets failed
  }
  

}


export {uploadToCloudinary}

