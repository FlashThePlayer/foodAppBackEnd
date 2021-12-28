import BasisDocument from "./BasisDocument";
import { Types } from "mongoose";

export default interface UserModel extends BasisDocument<UserModel> {
  name: string;
  email: string;
  password: string;
  friends: UserModel[] | Types.ObjectId[];
}
