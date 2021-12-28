import FoodModel from "./FoodModel";
import UserModel from "./UserModel";
import BasisDocument from "./BasisDocument";
import { Types } from "mongoose";

export default interface DayModel extends BasisDocument<DayModel> {
  date: Date;
  foods: FoodModel[] | Types.ObjectId;
  creator: UserModel[] | Types.ObjectId;
}
