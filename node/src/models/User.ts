import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  nickname: string;
  password: string;
  refreshToken?: string;
}

const UserSchema = new Schema<IUser>(
  {
    nickname: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
