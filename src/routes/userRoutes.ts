// userRoutes.js
const express = require("express");
const router = express.Router();
import * as userController from "../controllers/userController";
import * as FileController from "../controllers/fileController";

// Define routes
router.put(
    "/updatePicture",
    FileController.uploadPicture,
);

export default router;
