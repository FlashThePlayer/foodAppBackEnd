import UserModel from "../../models/User";
import FoodModel from "../../models/Food";
import IUser from "../../types/models/UserModel";
import throwError from "../../util/Error";
import queryBuilder from "../../util/QueryBuilder";
import ServerRequest from "../../types/ServerRequest";
import { Types } from "mongoose";
import {
  CreateFoodResolver,
  DeleteFoodResolver,
  Food,
  FoodData,
  GetFoodResolver,
  GetFoodsResolver,
  GetRandomFoodsResolver,
  SearchFoodResolver,
} from "../../types/resolver/FoodResolver";

export const createFood = async function (
  { foodInput }: CreateFoodResolver,
  req: ServerRequest
): Promise<Food> {
  if (!req.isAuth) {
    throwError(401, "not authenticated!");
  }

  const user = await UserModel.findById(req.userId);
  if (!user) {
    throwError(401, "user not found!");
  } else {
    const food = new FoodModel({
      name: foodInput.name,
      link: foodInput.link,
      pictureLink: foodInput.pictureLink,
      recipe: foodInput.recipe,
      favorite: foodInput.favorite,
      rating: foodInput.rating,
      difficulty: foodInput.difficulty,
      creator: user,
      keywords: foodInput.keywords,
    });

    const dbFood = await food.save();

    return {
      ...dbFood._doc,
      _id: dbFood._id.toString(),
      creator: (<IUser>dbFood.creator)._doc,
      createdAt: dbFood.createdAt.toISOString(),
      updatedAt: dbFood.updatedAt.toISOString(),
    };
  }
  throw new Error("reached unreachable code in createFood!");
};

export const deleteFood = async function (
  { id }: DeleteFoodResolver,
  req: ServerRequest
): Promise<true | false> {
  if (!req.isAuth) {
    throwError(401, "not authenticated!");
  }

  const dbFood = await FoodModel.findById(id);
  if (!dbFood || (<IUser>dbFood.creator)._id.toString() !== req.userId) {
    // 404 is intentional, other users trying to get food
    // from someone else should not know if they have the right id
    throwError(404, "food not found!");
  }

  try {
    await FoodModel.findByIdAndDelete(id);
    return true;
  } catch (e: unknown) {
    console.log(e);
    return false;
  }
};

export const getFood = async function (
  { id }: GetFoodResolver,
  req: ServerRequest
): Promise<Food> {
  if (!req.isAuth) {
    throwError(401, "not authenticated!");
  }

  const dbFood = await FoodModel.findById(id);
  if (!dbFood || (<IUser>dbFood.creator)._id.toString() !== req.userId) {
    // 404 is intentional, other users trying to get food
    // from someone else should not know if they have the right id
    throwError(404, "food not found!");
  } else {
    return {
      ...dbFood._doc,
      _id: dbFood._id.toString(),
      creator: (<IUser>dbFood.creator)._doc,
      createdAt: dbFood.createdAt.toISOString(),
      updatedAt: dbFood.updatedAt.toISOString(),
    };
  }
  throw new Error("reached unreachable code in getFood!");
};

export const searchFood = async function (
  { name }: SearchFoodResolver,
  req: ServerRequest
): Promise<Food[]> {
  if (!req.isAuth || !req.userId) {
    throwError(401, "not authenticated!");
  }
  const dbFoods = await FoodModel.find({
    name: name,
    creator: new Types.ObjectId(req.userId),
  });
  if (!dbFoods) {
    throwError(404, "food not found!");
  }
  return dbFoods.map((food) => {
    return {
      ...food._doc,
      _id: food._id.toString(),
      creator: (<IUser>food.creator)._doc,
      createdAt: food.createdAt.toISOString(),
      updatedAt: food.updatedAt.toISOString(),
    };
  });
};

export const getRandomFood = async function (
  _args: GetRandomFoodsResolver,
  req: ServerRequest
): Promise<Food> {
  if (!req.userId || !req.isAuth) {
    throwError(401, "not authenticated!");
  } else {
    const selectQuery = queryBuilder({}, req.userId);
    const foodCount = await FoodModel.find(selectQuery).countDocuments();
    const randomNumber = _getRandomInt(0, foodCount);
    const randomFood = await FoodModel.findOne(selectQuery).skip(randomNumber);

    if (!randomFood) {
      throwError(401, "no food found!");
    } else {
      return {
        ...randomFood._doc,
        _id: randomFood._id.toString(),
        creator: (<IUser>randomFood.creator)._doc,
        createdAt: randomFood.createdAt.toISOString(),
        updatedAt: randomFood.updatedAt.toISOString(),
      };
    }
  }
  throw new Error("reached unreachable code in getRandomFood!");
};

export const getFoods = async (
  { page = 1, query }: GetFoodsResolver,
  req: ServerRequest
): Promise<FoodData> => {
  if (!req.isAuth || !req.userId) {
    throwError(401, "not authenticated!");
  } else {
    const selectQuery = queryBuilder(query, req.userId);

    const FOODS_PER_PAGE = 5;
    const foodCount = await FoodModel.find(selectQuery).countDocuments();
    const maxPageSize = Math.ceil(foodCount / FOODS_PER_PAGE);
    const skipFoods = (page - 1) * FOODS_PER_PAGE;
    const dbFoods = await FoodModel.find(selectQuery)
      .sort({ createdAt: -1 })
      .skip(skipFoods)
      .limit(FOODS_PER_PAGE);
    return {
      foods: dbFoods.map((dbFood) => {
        return {
          ...dbFood._doc,
          _id: dbFood._id.toString(),
          creator: (<IUser>dbFood.creator)._doc,
          createdAt: dbFood.createdAt.toISOString(),
          updatedAt: dbFood.updatedAt.toISOString(),
        };
      }),
      totalPages: maxPageSize,
    };
  }
  throw new Error("reached unreachable code in getFoods!");
};

const _getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
