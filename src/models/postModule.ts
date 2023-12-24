// post.ts
import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./userModule";

export interface IComment extends Document {
  text: string;
  author: IUser["_id"];
}

export interface IPost extends Document {
  name: string;
  pictureUrl: string;
  gameFileUrl: string;
  comments: IComment[];
  creatorName: string;
  creatorUserId : string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const postSchema = new Schema<IPost>(
  {
    name: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    gameFileUrl: { type: String, required: true },
    comments: { type: [commentSchema], default: [] },
    creatorName: { type: String, required: true },
    creatorUserId : { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
