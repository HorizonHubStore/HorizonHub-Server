// src/controllers/authController.ts
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import User from "../models/user_module";

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET as string;
const jwtTokenExpiration: string = process.env.JWT_TOKEN_EXPIRATION as string;
const refreashTokenSecret: string = process.env.REFRESH_TOKEN_SECRET as string;

async function signup(req: Request, res: Response) {
    try {
        const { username, password, fullName } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = new User({
            username: username,
            password: hashedPassword,
            fullName: fullName,
        });

        await newUser.save();

        // Return a success message
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        // Generate a JWT token upon successful login
        const AccessToken = jwt.sign({ _id: user._id }, accessTokenSecret, {
            expiresIn: jwtTokenExpiration,
        });

        const refreashToken = jwt.sign({ _id: user._id }, refreashTokenSecret);

        if (user.tokens == null) user.tokens = [refreashToken];
        else user.tokens.push(refreashToken);
        await user.save();
        // Return the token as { token }
        res.status(200).send({
            accessToken: AccessToken,
            refreashToken: refreashToken,
            userData:user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function refreashToken(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(" ")[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, refreashTokenSecret, async (err, userInfo) => {
        if (err) {
            return res.status(403).send(err.message);
        }

        try {
            const user = await User.findById((userInfo as JwtPayload)._id);

            if (!user?.tokens) {
                throw new Error("User tokens not available");
            }

            if (!user.tokens.includes(token)) {
                //@ts-ignore
                user.tokens = [];
                await user?.save();
                return res.status(403).send("Invalid request");
            }

            const AccessToken = jwt.sign(
                { _id: user?._id },
                accessTokenSecret,
                {
                    expiresIn: jwtTokenExpiration,
                }
            );

            const refreashToken = jwt.sign(
                { _id: user?._id },
                refreashTokenSecret
            );
            user.tokens[user.tokens.indexOf(token)] = refreashToken;
            await user?.save();
            res.status(200).send({
                accessToken: AccessToken,
                refreashToken: refreashToken,
            });
        } catch (err) {
            return res.status(403).send(err);
        }
    });
}

async function logout(req: Request, res: Response) {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(" ")[2];
    
    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, refreashTokenSecret, async (err, userInfo) => {
        if (err) {
            return res.status(403).send(err.message);
        }
        const user = await User.findById((userInfo as JwtPayload)._id);

        try {
            if (!user?.tokens) {
                throw new Error("User tokens not available"); // or handle it differently
            }

            if (!user.tokens.includes(token)) {
                //@ts-ignore
                user.tokens = [];
                await user.save();
                return res.status(403).send("Invalid request");
            }
            user.tokens.splice(user.tokens.indexOf(token), 1);
            await user.save();
            res.status(200).send();
        } catch (err) {
            return res.status(403).send();
        }
    });
    res.json({ message: "Logged out successfully" });
}

async function dashboard(req: Request, res: Response) {
    res.json({ message: "Welcome to the dashboard", user: req.body.user });
}

export { signup, login, logout, refreashToken, dashboard };
