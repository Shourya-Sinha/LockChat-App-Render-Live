import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from './Routes/AuthRoute.js';
import contactRoute from './Routes/ContactRoute.js';
import messageRoute from './Routes/MessageRoute.js';
import setupSocket from "./socket.js";
import channelRoute from './Routes/ChannelRoute.js';
import path from 'path';
const __dirname = path.resolve();


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const db = process.env.DB_URL;

app.use(cors({
    origin: [process.env.ORIGIN], // replace with your frontend URL
    methods:["GET","PUT","POST","DELETE","PATCH"], //
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     next();
//   });

app.use('/uploads/profiles',express.static('uploads/profiles'));
app.use('/uploads/files',express.static('uploads/files',{setHeaders:(res,path,stat)=>{res.set('Content-Length',stat.size);}}));
// app.use('/uploads/files', (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     next();
// }, express.static('uploads/files'));
// app.use('/uploads/files', (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     next();
//   }, express.static('uploads/files', {
//     setHeaders: (res, path, stat) => {
//       res.set('Content-Length', stat.size); // Explicitly set Content-Length
//     }
//   }));
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api/auth',authRoute);
app.use('/api/contacts',contactRoute);
app.use('/api/messages',messageRoute);
app.use('/api/channel',channelRoute);

const server = app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`);
});

setupSocket(server);

mongoose.connect(db).then(()=> console.log('DB Connection established')).catch((err)=> console.error('Error connecting to Database',err));

app.use(express.static(path.join(__dirname,'client/dist')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
})