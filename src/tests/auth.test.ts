// auth.test.ts

import request from "supertest";
import app, {server} from "../app";

import {closeDB} from "../db/db";
import User from "../models/user_module";

const fullname = "estFudlName";
const userName = "estUserName";
const userPassword = "testUserPassword";

beforeAll(async () => {
    // Delete the user before running tests
    await User.deleteOne({username: userName});
});

// Sign up test
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


//Log in test
let accessToken = "";
let refreashToken = "";
describe("Login", () => {
    it("Login user", async () => {
        const res = await request(app).post("/auth/login").send({
            username: userName,
            password: userPassword,
        });
        expect(res.statusCode).toEqual(200);
        accessToken = res.body.accessToken;
        refreashToken = res.body.refreashToken;

        expect(accessToken).not.toEqual(null || undefined);
        expect(refreashToken).not.toEqual(null || undefined);
    });
});


//Token Access and Resfreash tests
let newAccessToken = "";
let newRefreashToken = "";
jest.setTimeout(30000);
describe("Token access", () => {
    it("timeout access", async () => {
        await new Promise((r) => setTimeout(r, 3 * 1000));
        const res = await request(app)
            .get("/auth/dashboard")
            .set({authorization: "JWT " + accessToken});
        expect(res.statusCode).not.toEqual(200);
    });

    it("Refreash token", async () => {
        const res = await request(app)
            .get("/auth/refreashToken")
            .set({authorization: "JWT " + refreashToken});
        expect(res.statusCode).toEqual(200);
        newAccessToken = res.body.accessToken;
        newRefreashToken = res.body.refreashToken;
        expect(newAccessToken).not.toEqual(null || undefined);
        expect(newRefreashToken).not.toEqual(null || undefined);
    });
});


// Log out tests
describe("Log out", () => {
    it("should logout with authentication", async () => {
        const response = await request(app)
            .post("/auth/logout")
            .set({
                authorization: "JWT " + newAccessToken + " " + newRefreashToken,
            });
        expect(response.statusCode).toEqual(200);
    });

    it("should not logout without authentication", async () => {
        const response = await request(app).post("/auth/logout").send();

        // Expecting a 401 status code since the user is not authenticated
        expect(response.status).toBe(401);
    });
});

afterAll(async () => {
    try {
        // Delete the user after running tests
        await User.deleteOne({username: userName});

        // Close the MongoDB connection after all tests
        await closeDB();
    } catch (error) {
        console.error("Error during cleanup:", error);
    } finally {
        // Close the server after all tests
        server.close();
    }
});
