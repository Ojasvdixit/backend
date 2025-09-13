import multer from 'multer';

const storage = multer.diskStorage({
  destination:function(req,file,cb){       //!  cb stands for callback , file is a parameter from multer which contains the file info
    cb(null,"./public/temp")
  },
  filename:function(req,file,cb){
    cb(null,file.originalname)
  }

})

export const upload =multer(
  {storage:storage}
)