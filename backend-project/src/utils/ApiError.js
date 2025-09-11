//? Error is the class in nodejs to handle errors

//!  class → blueprint for creating objects.
class ApiError extends Error {
 
  //!    constructor: special method called when you create an object
  constructor(
    statusCode,
    message= 'Something went wrong',
    errors = [],
    stack = ''

  ){

    //! super is used in two ways: Inside constructor: to call the parent’s constructor,  Inside methods: to call the parent’s methods.



    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success= false
    this.errors = errors

    if(stack){
      this.stack =stack
    }else{
      Error.captureStackTrace(this,this.constructor)
    }

  }
   
}

export {ApiError}