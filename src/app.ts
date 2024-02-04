// src/app.ts
import fs from 'fs'
import https from 'https'
import express from 'express';
import {closeDB, connectDB} from './db/db';
import postRouter from './routes/postRoutes'
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import cors from 'cors';
import path from 'path';
import SwaggerDocs from "./utils/swagger";

const app = express();
const PORT: number = process.env.PORT || 4001;

// Connect to MongoDB
connectDB();


app.use(function(req,res,next){
 res.header("Access-Control-Allow-Origin",'*')
 res.header("Access-Control-Allow-Headers",'*')
 res.header("Access-Control-Allow-Methods",'*')
 next()
})
const origins : string[] = 
['https://10.10.248.171:4000','https://193.106.55.171:4000','https://node11.cs.colman.ac.il:4000']
const corsOptions = {
  origin: origins,
  credentials: true,
};

app.use(cors(corsOptions));


// Middleware
app.use(express.json());


app.use('/images', express.static(path.join(process.cwd(), 'public', 
'images')));

app.use("/post", postRouter);
app.use('/auth', authRouter)
app.use('/user', userRouter)



// Start server
//export const server = app.listen(PORT, () => {
//    console.log(`Server is running on port ${PORT}`);

SwaggerDocs(app, PORT);
//});

const option = {
  key : fs.readFileSync('client-key.pem'),
  cert: fs.readFileSync('client-cert.pem')
};
https.createServer(option,app).listen(443)





