import express from 'expresss'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app= express();


//! use is used to deal with middleware and system configuration

app.use(cors({        
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))

app.use(express.json({limit:"16kb"}));   //! it is used to parse json data coming from client to server

app.use(express.urlencoded({extended:true}));  

//! urlencoded is a middleware in Express that parses incoming requests with application/x-www-form-urlencoded payloads (the format used by HTML forms),  extended:true means it can parse nested object Eg -->>

// username=ojasv&details[city]=Delhi

//?  to ->

//  {
//   username: 'ojasv',
//   details: { city: 'Delhi' }
// }


 //! it is used to serve static files like images ,css files ,js files
 app.use(express.static('public')) 
