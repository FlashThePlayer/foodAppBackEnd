import { Document } from "mongoose";

export default interface TimestampedDocument<T> extends Document {
  _doc: T;
  createdAt: Date;
  updatedAt: Date;
}
