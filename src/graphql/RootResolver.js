const { createUser, loginUser } = require("./resolvers/User");
const { getDays, patchDay } = require("./resolvers/Day");
const {
  createFood,
  getFoods,
  getFood,
  deleteFood,
  getRandomFood,
} = require("./resolvers/Food");

module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  createFood: createFood,
  getDays: getDays,
  patchDay: patchDay,
  getFoods: getFoods,
  getFood: getFood,
  deleteFood: deleteFood,
  getRandomFood: getRandomFood,
};
