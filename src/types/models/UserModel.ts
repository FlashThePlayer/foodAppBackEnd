import TimestampedDocument from "./TimestampedDocument";
import { Types } from "mongoose";

export default interface UserModel extends TimestampedDocument<UserModel> {
  name: string;
  email: string;
  password: string;
  friends: UserModel[] | Types.ObjectId[];
}
