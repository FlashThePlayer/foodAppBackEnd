const User = require("../../models/User");
const Food = require("../../models/Food");
const Error = require("../../util/Error");

exports.createFood = async function({ foodInput }, req) {
  const user = await User.findOne({ name: "timu" });
  if (!user) {
    Error.throwError(401, "user not found!");
  }

  const food = new Food({
    name: foodInput.name,
    link: foodInput.link,
    favorite: foodInput.favorite,
    rating: foodInput.rating,
    difficulty: foodInput.difficulty,
    creator: user,
    keywords: foodInput.keywords
  });

  const dbFood = await food.save();

  return {
    ...dbFood._doc,
    _id: dbFood._id.toString(),
    createdAt: dbFood.createdAt.toISOString(),
    updatedAt: dbFood.updatedAt.toISOString()
  };
};

exports.getFood = async function({ name }, req) {
  const dbFood = await Food.findOne({ name: name });
  if (!dbFood) {
    Error.throwError(404, "food not found!");
  }
  return {
    ...dbFood._doc,
    _id: dbFood._id.toString(),
    createdAt: dbFood.createdAt.toISOString(),
    updatedAt: dbFood.updatedAt.toISOString()
  };
};

exports.getRandomFood = async function(args, req) {
  const dbFoods = await Food.find();
  if (dbFoods.length <= 0) {
    Error.throwError(401, "no food found!");
  }
  const randomFood = dbFoods[Math.floor(Math.random() * dbFoods.length)]; // THIS NEEDS FIXING -> MONGO HAS A RANDOM FUNC!!!

  return {
    ...randomFood._doc,
    _id: randomFood._id.toString(),
    createdAt: randomFood.createdAt.toISOString(),
    updatedAt: randomFood.updatedAt.toISOString()
  };
};

exports.getFoods = async ({ page }, req) => {
  if (!page) {
    page = 1;
  }
  const FOODS_PER_PAGE = 5;
  const foodCount = Food.find().countDocuments();
  const skipFoods = page === 1 ? 0 : page * FOODS_PER_PAGE;
  const foods = await Food.find()
    .sort({ createdAt: -1 })
    .skip(skipFoods)
    .limit(FOODS_PER_PAGE);
  return {
    foods: foods.map(food => {
      return {
        ...food._doc,
        _id: food._id.toString(),
        createdAt: food.createdAt.toISOString(),
        updatetAt: food.updatedAt.toISOString()
      };
    }),
    totalPages: foodCount
  };
};
