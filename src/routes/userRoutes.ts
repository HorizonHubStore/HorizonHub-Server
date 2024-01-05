// userRoutes.js
import express from "express";
import * as FileController from "../controllers/fileController";

const router = express.Router();

// Define routes
router.put(
    "/updatePicture",
    FileController.uploadPicture,
);

export default router;
