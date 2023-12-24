// routes.ts
import express from "express";
import authenticate from '../middleware/auth';
import * as postController from "../controllers/postController";
import multer from 'multer'
import path from 'path'

const router = express.Router();
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

// Post routes
router.post("/createPost", authenticate, upload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'gameFile', maxCount: 1 }
  ]),postController.createPost);

router.get("/getAllPosts",postController.getAllPosts)
router.put("/posts/:id", authenticate, postController.updatePost); 
router.delete("/delete/:id", authenticate, postController.deletePost); 

export default router;
