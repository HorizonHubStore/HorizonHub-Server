// routes.ts
import express from "express";
import authenticate from "../middleware/auth";
import * as postController from "../controllers/postController";
import * as fileController from "../controllers/fileController";

const router = express.Router();

router.post("/createPost",authenticate,fileController.uploadPostFiles,postController.createPost);
router.get("/getAllPosts", authenticate, postController.getAllPosts);
router.put("/update/:id", authenticate, postController.updatePost);
router.delete("/delete/:id", authenticate, postController.deletePost);
router.get("/getPost/:id", authenticate, postController.getPost);
router.post("/addComment",authenticate, postController.addComment)
router.get("/getPostComments/:postId",authenticate, postController.getPostComments)


export default router;
