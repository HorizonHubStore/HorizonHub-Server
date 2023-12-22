// src/app.ts
import express from 'express';
import {closeDB, connectDB} from './db/db';
import authRouter from './routes/authRoutes'
import userRouter from './routes/userRoutes'
import cors from 'cors'
import path from 'path'

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();


app.use(cors({
    origin: 'http://localhost:5175',
    credentials: true,
}));

// Middleware
app.use(express.json());

app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));


app.use('/auth', authRouter)
app.use('/user', userRouter)

// Start server
export const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing server and MongoDB connection...');
    server.close(() => {
        closeDB().finally(() => {
            console.log('Server and MongoDB connection closed.');
            process.exit(0);
        });
    });
});


export default app;
