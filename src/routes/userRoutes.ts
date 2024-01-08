// userRoutes.js
import express from "express";
const router = express.Router();
import * as userController from "../controllers/userController";
import authenticate from "../middleware/auth";
import { uploadFile } from "../controllers/fileController";

// Define routes
router.put(
    "/updatePicture",
    authenticate,
    uploadFile,
    userController.updateUserPicture
);
router.get("/getUserData/:userId", authenticate, userController.getUserById);

export default router;
