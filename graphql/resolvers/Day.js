const User = require("../../models/User");
const Day = require("../../models/Day");
const Food = require("../../models/Food");
const UtilError = require("../../util/Error");
const Query = require("../../util/QueryBuilder");

const mongoose = require("mongoose");

exports.patchDay = async function ({ dayInput }, req) {
  if (!req.isAuth) {
    UtilError.throwError(401, "not authenticated!");
  }

  const user = await User.findById(req.userId);
  if (!user) {
    UtilError.throwError(401, "user not found!");
  }

  const dbDay = await Day.findOne({
    date: dayInput.date,
    creator: new mongoose.Types.ObjectId(req.userId),
  });

  const foodPromises = dayInput.foodId.map(foodId => Food.findById(foodId))
  const foodArray = await Promise.all(foodPromises);

  let day;

  if (!dbDay) {
    day = new Day({
      date: dayInput.date,
      creator: user,
      foods: foodArray,
    });
  } else {
    day = dbDay;
    day.foods = foodArray;
  }

  const savedDay = await day.save();
  const populatedDay = await Day.populate(savedDay, { path: "foods" });

  return {
    date: _yyyymmdd(populatedDay.date),
    meals: populatedDay.foods,
  };
}

exports.getDays = async ({ date }, req) => {
  if (!req.isAuth) {
    UtilError.throwError(401, "not authenticated!");
  }

  const user = await User.findById(req.userId);
  if (!user) {
    UtilError.throwError(401, "user not found!");
  }

  const weekArray = _getWeek(new Date(date));

  const promiseArray = [];

  for (let index in weekArray) {
    let promise = Day.find({
      date: weekArray[index],
      creator: new mongoose.Types.ObjectId(req.userId),
    }).populate("foods");
    promiseArray.push(promise);
  }

  try {
    const response = await Promise.all(promiseArray);
    const returnValue = [];
    response.forEach((data, index) => {
      const mealDate = weekArray[index];
      const meals = [];
      if (data.length !== 0) {
        data[0]._doc.foods.forEach((foods) => {
          meals.push(foods._doc);
        });
      }
      returnValue.push({ date: mealDate, meals: meals });
    });
    return returnValue;
  } catch (e) {
    UtilError.throwError(
      500,
      "Internal server error. Could not get all Days for week"
    );
  }
};

const _getWeek = (date) => {
  const sunday = new Date(date.setDate(date.getDate() - date.getDay()));
  const result = [_yyyymmdd(new Date(sunday))];

  while (sunday.setDate(sunday.getDate() + 1) && sunday.getDay() !== 0) {
    result.push(_yyyymmdd(new Date(sunday)));
  }
  return result;
};

const _yyyymmdd = (date) => {
  return date.toISOString().split("T")[0];
};
