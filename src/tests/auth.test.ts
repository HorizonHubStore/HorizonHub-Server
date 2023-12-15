// auth.test.ts

import request from "supertest";
import app from "../app";
import { server } from "../app";

import { connectDB, closeDB } from "../db/db";
import User from "../models/user_module";
const fullname = "estFudlName";
const userName = "estUserName";
const userPassword = "testUserPassword";

beforeAll(async () => {
    // Connect to MongoDB before running tests
    await connectDB();

    // Delete the user before running tests
    await User.deleteOne({ username: userName });
});

describe("Sign Up", () => {
    it("Add new user", async () => {
        const res = await request(app).post("/auth/signup").send({
            username: userName,
            password: userPassword,
            fullName: fullname,
        });
        expect(res.statusCode).toEqual(200);
    });
});

describe("Login", () => {
    it("Login user", async () => {
        const res = await request(app).post('/auth/login').send({
            username: userName,
            password: userPassword,
        })
        expect(res.statusCode).toEqual(200)
        const accessToken = res.body.accessToken
        const refreashToken = res.body.refreashToken
        
        expect(accessToken).not.toEqual(null || undefined)
        expect(refreashToken).not.toEqual(null || undefined)

    });
});

describe("Authentication Endpoints", () => {
    it("should not logout without authentication", async () => {
        const response = await request(app).post("/auth/logout").send();

        // Expecting a 401 status code since the user is not authenticated
        expect(response.status).toBe(401);
    });
});

afterAll(async () => {
    try {
        // Delete the user after running tests
        await User.deleteOne({ username: userName });

        // Close the MongoDB connection after all tests
        await closeDB();
    } catch (error) {
        console.error("Error during cleanup:", error);
    } finally {
        // Close the server after all tests
        server.close();
    }
});
