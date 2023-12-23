// userRoutes.js
const express = require("express");
const router = express.Router();
import * as userController from "../controllers/userController";

import multer from 'multer'
import path from 'path'

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
router.put("/updatePicture",upload.single('file'),userController.updateUserPicture);

export default router;
