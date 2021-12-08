import { Schema, model } from "mongoose";
import DayModel from "../types/models/DayModel";

const daySchema = new Schema<DayModel>(
  {
    date: { type: String, required: true },
    foods: [{ type: Schema.Types.ObjectId, ref: "Food", required: false }],
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<DayModel>("Day", daySchema);
