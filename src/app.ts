// src/app.ts
import express from 'express';
import {connectDB} from './db/db';
import authRouter from './routes/auth_routes'

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use('/auth',authRouter)

// Start server
export const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



export default app;
