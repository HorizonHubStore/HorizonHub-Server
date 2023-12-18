// src/app.ts
import express from 'express';
import {closeDB, connectDB} from './db/db';
import authRouter from './routes/auth_routes'
import cors from 'cors'

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
app.use('/auth', authRouter)

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
