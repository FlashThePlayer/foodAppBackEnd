import UserModel from "../../models/User";
import DayModel from "../../models/Day";
import FoodModel from "../../models/Food";
import throwError from "../../util/Error";
import ServerRequest from "../../types/ServerRequest";
import { Types } from "mongoose";
import IUser from "../../types/models/UserModel";
import IFood from "../../types/models/FoodModel";
import IDay from "../../types/models/DayModel";
import {
  Day,
  DayInputData,
  GetDaysResolver,
  PatchDayResolver,
  RandomizeDaysResolver,
} from "../../types/resolver/DayResolver";
import { getRandomFood } from "./Food";
import { Food } from "../../types/resolver/FoodResolver";

export const patchDay = async function (
  { dayInputs }: PatchDayResolver,
  req: ServerRequest
): Promise<Day[]> {
  if (!req.isAuth) {
    throwError(401, "not authenticated!");
  }

  const user = await UserModel.findById(req.userId);
  if (!user) {
    throwError(401, "user not found!");
  } else {
    return await _populateDays(dayInputs, user);
  }
  throw new Error("reached unreachable code in patchDay!");
};

export const getDays = async (
  { date }: GetDaysResolver,
  req: ServerRequest
): Promise<Day[]> => {
  if (!req.isAuth) {
    throwError(401, "not authenticated!");
  }

  const user = await UserModel.findById(req.userId);
  if (!user) {
    throwError(401, "user not found!");
  }

  const weekArray = _getWeek(new Date(date));
  const promiseArray = [];

  for (let index in weekArray) {
    let promise = DayModel.findOne({
      date: new Date(weekArray[index]),
      creator: new Types.ObjectId(req.userId),
    }).populate("foods");
    promiseArray.push(promise);
  }

  try {
    const response = await Promise.all(promiseArray);
    const returnValue: Day[] = [];

    response.forEach((data, index) => {
      const mealDate = weekArray[index];
      const meals: Food[] = [];
      if (data != null && Array.isArray(data.foods)) {
        data.foods.forEach((dbFood: IFood) => {
          const food: Food = {
            ...dbFood._doc,
            creator: (<IUser>dbFood.creator)._doc,
            createdAt: dbFood.createdAt.toISOString(),
            updatedAt: dbFood.updatedAt.toISOString(),
          };
          meals.push(food);
        });
      }
      returnValue.push({ date: mealDate, meals: meals });
    });
    return returnValue;
  } catch (e: unknown) {
    throwError(500, "Internal server error. Could not get all Days for week");
  }
  throw new Error("reached unreachable code in getDays!");
};

export const randomizeDays = async function (
  { dayInputs }: RandomizeDaysResolver,
  req: ServerRequest
): Promise<Day[]> {
  if (!req.isAuth) {
    throwError(401, "not authenticated!");
  }

  const user = await UserModel.findById(req.userId);
  if (!user) {
    throwError(401, "user not found!");
  } else {
    let populatedDays = await _populateDays(dayInputs, user);

    for (const day of populatedDays) {
      if (Array.isArray(day.meals) && day.meals.length === 0) {
        const food = await getRandomFood({ tags: undefined }, req);
        day.meals = [food];
      }
    }
    return populatedDays;
  }
  throw new Error("reached unreachable code in randomizeDay!");
};

const _patchDay = async function (
  dayInput: DayInputData,
  user: IUser
): Promise<Day> {
  const selectedDate = new Date(dayInput.date);
  const dbDay = await DayModel.findOne({
    date: selectedDate,
    creator: user,
  });

  const foodPromises = dayInput.foodId.map((foodId) =>
    FoodModel.findById(foodId)
  );
  const foodArray = (await Promise.all(foodPromises)).filter(notEmpty);

  let day: IDay;
  if (!dbDay) {
    day = new DayModel({
      date: selectedDate,
      creator: user,
      foods: foodArray,
    });
  } else {
    day = dbDay;
    day.foods = foodArray;
  }

  const savedDay = await day.save();
  const dbDayPopulated = await DayModel.populate(savedDay, { path: "foods" });
  const foods: Food[] = (<IFood[]>dbDayPopulated.foods).map((dbFood) => {
    return {
      ...dbFood._doc,
      creator: (<IUser>dbFood.creator)._doc,
      createdAt: dbFood.createdAt.toISOString(),
      updatedAt: dbFood.updatedAt.toISOString(),
    };
  });
  return {
    meals: foods,
    date: dayInput.date,
  };
};

const _populateDays = async function (dayInputs: DayInputData[], user: IUser) {
  let populatedDays: Day[] = [];
  for (let index in dayInputs) {
    const populatedDay = await _patchDay(dayInputs[index], user);
    populatedDays.push({
      date: _yyyymmdd(new Date(populatedDay.date)),
      meals: populatedDay.meals,
    });
  }
  return populatedDays;
};

const _getWeek = (date: Date) => {
  const sunday = new Date(date.setDate(date.getDate() - date.getDay()));
  const result = [_yyyymmdd(new Date(sunday))];

  while (sunday.setDate(sunday.getDate() + 1) && sunday.getDay() !== 0) {
    result.push(_yyyymmdd(new Date(sunday)));
  }
  return result;
};

const _yyyymmdd = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const notEmpty = (value: IFood | null | undefined): value is IFood => {
  return !(value === null || value === undefined);
};
