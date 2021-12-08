import { Types } from "mongoose";

export interface ClientQuery {
  name?: string;
  favorite?: boolean;
  rating?: number;
  difficulty?: string;
}

export interface MongooseQuery {
  creator: Types.ObjectId;
  name?: { $regex: string; $options: "i" };
  favorite?: boolean;
  rating?: number;
  difficulty?: string;
}
