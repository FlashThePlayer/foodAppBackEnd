import BasisDocument from "./BasisDocument";
import UserModel from "./UserModel";
import { Types } from "mongoose";

export default interface FoodModel extends BasisDocument<FoodModel> {
  name: string;
  link?: string;
  pictureLink?: string;
  favorite: boolean;
  rating: number;
  difficulty: string;
  creator: UserModel | Types.ObjectId;
  keywords: string[];
  recipe?: string;
}
