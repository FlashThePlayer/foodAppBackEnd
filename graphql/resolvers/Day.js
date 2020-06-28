const User = require("../../models/User");
const Day = require("../../models/Day");
const UtilError = require("../../util/Error");
const Query = require("../../util/QueryBuilder");

const mongoose = require("mongoose");

exports.createDay = async function ({ dayInput }, req) {
  if (!req.isAuth) {
    UtilError.throwError(401, "not authenticated!");
  }

  const user = await User.findById(req.userId);
  if (!user) {
    UtilError.throwError(401, "user not found!");
  }

  const promiseArray = dayInput.map((data) => {
    const foodIdArray = data.foodId.map((food) => {
      return new mongoose.Types.ObjectId(food);
    });

    const day = new Day({
      date: data.date,
      foods: foodIdArray,
      creator: user,
    });

    return day.save();
  });

  const allPromiseResults = await Promise.allSettled(promiseArray);

  const errors = allPromiseResults.filter(
    (promise) => promise.status === "rejected"
  );

  return errors.length === 0;
};

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
    response.forEach((data) => {
      if (data.length !== 0) {
        const date = data[0]._doc.date;
        const meals = [];
        data[0]._doc.foods.forEach((foods) => {
          meals.push(foods._doc);
        });
        returnValue.push({ date: _yyyymmdd(date), meals: meals });
      }
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
