const bycript = require("bcrypt");

const User = require("../models/User");
const Food = require("../models/Food");
const Error = require("../util/Error");

module.exports = {
  createUser: async function({ userInput }, req) {
    const hashedpass = await bycript.hash(userInput.password, 12);
    const user = new User({
      name: userInput.name,
      email: userInput.email,
      password: hashedpass
    });

    const dbUser = await user.save();
    if (!dbUser) {
      Error.throwError(404, "could not create user!");
    }

    return {
      ...dbUser._doc,
      _id: dbUser._id.toString()
    };
  },

  createFood: async function({ foodInput }, req) {
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
  },
  getFood: async function({ name }, req) {
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
  }
};
