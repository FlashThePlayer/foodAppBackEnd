import { model, Schema } from "mongoose";
import FoodModel from "../types/models/FoodModel";

const foodSchema = new Schema<FoodModel>(
  {
    name: { type: String, required: true },
    link: { type: String, required: false },
    pictureLink: { type: String, required: false },
    favorite: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    difficulty: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    keywords: [{ type: String, require: true }],
    recipe: { type: String, require: false },
  },
  { timestamps: true }
);

export default model<FoodModel>("Food", foodSchema);
