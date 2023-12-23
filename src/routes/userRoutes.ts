// userRoutes.js
const express = require("express");
const router = express.Router();
import multer from 'multer'
import path from 'path'
import * as FileController from "../controllers/fileController";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the destination folder for your uploads
      cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
      // Specify the filename for the uploaded file
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({ storage: storage });
// Define routes
router.put("/updatePicture",FileController.uploadPicture);

export default router;
