import throwError from "./Error";
import { Types } from "mongoose";
import { MongooseQuery } from "../types/CustomQuery";
import { FoodQuery } from "../types/resolver/FoodResolver";

const queryBuilder = (query: FoodQuery, userId: string) => {
  if (!userId) {
    throwError(500, "query without a UserId is NOT valid!");
  }

  let selectQuery: MongooseQuery = { creator: Types.ObjectId(userId) };

  if (query) {
    if (query.name) {
      selectQuery = {
        ...selectQuery,
        name: { $regex: query.name, $options: "i" },
      };
    }
    if (query.favorite) {
      selectQuery = {
        ...selectQuery,
        favorite: query.favorite,
      };
    }
    if (query.rating) {
      selectQuery = {
        ...selectQuery,
        rating: query.rating,
      };
    }
    if (query.difficulty) {
      selectQuery = {
        ...selectQuery,
        difficulty: query.difficulty,
      };
    }
  }

  return selectQuery;
};

export default queryBuilder;
