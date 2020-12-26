const { createUser, loginUser } = require("./resolvers/User");
const { getDays, patchDay } = require("./resolvers/Day");
const {
  createFood,
  getFoods,
  getRandomFood
} = require("./resolvers/Food");

module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  createFood: createFood,
  getDays: getDays,
  patchDay: patchDay,
  getFoods: getFoods,
  getRandomFood: getRandomFood
};
