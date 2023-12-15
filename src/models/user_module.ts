import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  fullName: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
