import FoodModel from "./FoodModel";
import UserModel from "./UserModel";
import TimestampedDocument from "./TimestampedDocument";
import { Types } from "mongoose";

export default interface DayModel extends TimestampedDocument<DayModel> {
  date: Date;
  foods: FoodModel[] | Types.ObjectId;
  creator: UserModel[] | Types.ObjectId;
}
