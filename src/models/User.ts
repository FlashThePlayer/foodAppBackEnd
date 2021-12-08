import { Schema, model } from "mongoose";
import UserModel from "../types/models/UserModel";

const userSchema = new Schema<UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<UserModel>("User", userSchema);
