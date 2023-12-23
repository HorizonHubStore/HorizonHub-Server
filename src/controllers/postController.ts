// postController.ts
import { Request, Response } from "express";
import Post, { IPost } from "../models/postModule";

export const createPost = async (req: Request, res: Response) => {
  try {
    console.log(req.files);
        
    // Extract data from the request body
    const { name, creatorName } = req.body;

    // Extract file information from req.files
    const picture: Express.Multer.File = (req.files as any)['picture'][0];
    const gameFile: Express.Multer.File = (req.files as any)['gameFile'][0];

    // Construct the file paths
    const picturePath = `images/${picture.filename}`;
    const gameFilePath = `images/${gameFile.filename}`;
    
    // Create a new post object
    const newPost = new Post({
      name,
      creatorName,
      pictureUrl: picturePath,
      gameFileUrl: gameFilePath,
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const updatedPost: IPost | null = await Post.findByIdAndUpdate(postId, req.body, { new: true });
    
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);
    
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAllPosts = async (req: Request, res: Response) => {
  try {
    // Retrieve all posts from the database
    const allPosts: IPost[] = await Post.find();

    res.status(200).json(allPosts);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



