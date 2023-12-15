// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user_module';
const secretKey = require('../config/keys')

async function signup(req: Request, res: Response) {
  try {
    const { username, password, fullName } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = new User({ username, password: hashedPassword, fullName });
    await newUser.save();

    // Return a success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate a JWT token upon successful login
    const token = jwt.sign({ username: user.username }, secretKey);

    // Return the token as { token }
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function logout(req: Request, res: Response) {
  // Perform any logout-related actions (e.g., token blacklist)
  res.json({ message: 'Logged out successfully' });
}

async function dashboard(req: Request, res: Response) {
  res.json({ message: 'Welcome to the dashboard', user: req.body.user });
}

export { signup, login, logout, dashboard };
