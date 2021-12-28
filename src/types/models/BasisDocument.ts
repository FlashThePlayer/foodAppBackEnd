import { Document } from "mongoose";

export default interface BasisDocument<T> extends Document {
  _doc: T;
  createdAt: Date;
  updatedAt: Date;
}
