import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  fullName: string;
  tokens: string[];
  picture: string;
}
const defaultPicturePath = "images/default-user-profile.jpg"; // Set your default path here


const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  tokens: { type: [String], required: true },
  picture: { type: String, default: defaultPicturePath, required: true },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
