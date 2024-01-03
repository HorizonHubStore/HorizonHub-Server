// userRoutes.js
const express = require("express");
const router = express.Router();
import * as userController from "../controllers/userController";
import authenticate from "../middleware/auth";
import { uploadFile } from "../controllers/fileController";

router.put(
    "/updatePicture",
    authenticate,
    uploadFile,
    userController.updateUserPicture
);
router.get("/getUserData/:userId", authenticate, userController.getUserById);

export default router;
