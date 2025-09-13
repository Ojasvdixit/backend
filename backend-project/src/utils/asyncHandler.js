
//! Method 1

const asyncHandler=(requestHandler)=>{ 
  return (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err));
  }
}

export {asyncHandler};


//! Higher order functin in JS are which can accept function as a parameter or can return a function

//! Method 2

// const asyncHandler = (fn) => async (req, res, next) => {
//  try{
//    await fn(req, res, next);
//  }catch(err){
//    res.status(err.code||500).json({
//     success:'false',
//     message:err.message||'Internal server error'
//    })
//  }
//}