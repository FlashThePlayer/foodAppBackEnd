const User = require("../../models/User");
const Food = require("../../models/Food");
const UtilError = require("../../util/Error");
const Query = require("../../util/QueryBuilder");

const mongoose = require("mongoose");

exports.createFood = async function ({ foodInput }, req) {
  if (!req.isAuth) {
    UtilError.throwError(401, "not authenticated!");
  }

  const user = await User.findById(req.userId);
  if (!user) {
    UtilError.throwError(401, "user not found!");
  }

  const food = new Food({
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
    createdAt: dbFood.createdAt.toISOString(),
    updatedAt: dbFood.updatedAt.toISOString(),
  };
};

exports.deleteFood = async function ({id}, req) {
  if (!req.isAuth) {
    UtilError.throwError(401, "not authenticated!");
  }

  const dbFood = await Food.findById(id);

  if (!dbFood || dbFood.creator._id.toString() !== req.userId) {
    // 404 is intentional, other users trying to get food
    // from someone else should not know if they have the right id
    UtilError.throwError(404, "food not found!");
  }

  try {
    await Food.findByIdAndDelete(id);
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

exports.getFood = async function ({ id }, req) {
  if (!req.isAuth) {
    UtilError.throwError(401, "not authenticated!");
  }

  const dbFood = await Food.findById(id);

  if (!dbFood || dbFood.creator._id.toString() !== req.userId) {
    // 404 is intentional, other users trying to get food
    // from someone else should not know if they have the right id
    UtilError.throwError(404, "food not found!");
  }

  return {
    ...dbFood._doc,
    _id: dbFood._id.toString(),
    createdAt: dbFood.createdAt.toISOString(),
    updatetAt: dbFood.updatedAt.toISOString(),
  };
};

exports.searchFood = async function ({ name }, req) {
  if (!req.isAuth) {
    UtilError.throwError(401, "not authenticated!");
  }

  const dbFoods = await Food.find({
    name: name,
    creator: new mongoose.Types.ObjectId(req.userId),
  });
  if (!dbFoods) {
    UtilError.throwError(404, "food not found!");
  }

  const returnValue = dbFoods.map((food) => {
    return {
      ...food._doc,
      _id: food._id.toString(),
      createdAt: food.createdAt.toISOString(),
      updatetAt: food.updatedAt.toISOString(),
    };
  });

  return returnValue;
};

exports.getRandomFood = async function (args, req) {
  if (!req.isAuth) {
    UtilError.throwError(401, "not authenticated!");
  }

  const dbFoods = await Food.aggregate().sample(1); //returns an array
  if (dbFoods.length <= 0) {
    UtilError.throwError(401, "no food found!");
  }

  const randomFood = dbFoods[0];
  return {
    ...randomFood,
    _id: randomFood._id.toString(),
    createdAt: randomFood.createdAt.toISOString(),
    updatedAt: randomFood.updatedAt.toISOString(),
  };
};

exports.getFoods = async ({ page, query }, req) => {
  if (!req.isAuth) {
    UtilError.throwError(401, "not authenticated!");
  }

  if (!page) {
    page = 1;
  }

  const selectQuery = Query.build(query, req.userId);

  const FOODS_PER_PAGE = 5;
  const foodCount = await Food.find(selectQuery).countDocuments();
  const maxPageSize = Math.ceil(foodCount / FOODS_PER_PAGE);
  const skipFoods = (page - 1) * FOODS_PER_PAGE;
  const foods = await Food.find(selectQuery)
    .sort({ createdAt: -1 })
    .skip(skipFoods)
    .limit(FOODS_PER_PAGE);
  return {
    foods: foods.map((food) => {
      return {
        ...food._doc,
        _id: food._id.toString(),
        createdAt: food.createdAt.toISOString(),
        updatetAt: food.updatedAt.toISOString(),
      };
    }),
    totalPages: maxPageSize,
  };
};
