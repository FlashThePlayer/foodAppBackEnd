import TimestampedDocument from "./TimestampedDocument";

export default interface UserModel extends TimestampedDocument<UserModel> {
  name: string;
  email: string;
  password: string;
}
