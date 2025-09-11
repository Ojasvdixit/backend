//require('dotenv').config({path:'./env'});      //! First method to import dotenv package

import dotenv from 'dotenv';
dotenv.config({
  // path:'./env'
})
import connectDB from './db/db.js';
connectDB();  //? connecting to database

//? FIRST approach to connect to database and start server

// import express from 'express';
// const app = express();
// //!IIFE

// //! always use try catch block , async await when dealing with database

// (async () => {
//   try{
//   await   mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

//   app.on('error', (err) => {  
//     console.error('ERROR: ', err);
//     throw err
//   });

//   app.listen(process.env.PORT, () => {
//     console.log(`Server started on PORT ${process.env.PORT}`);
//   });

//   }catch(err){
//     console.error('ERROR',err);
//   }
// })()