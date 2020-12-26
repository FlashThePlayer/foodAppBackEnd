const { createUser, loginUser } = require("./resolvers/User");
const { getDays, createDay, deleteFoodFromDay } = require("./resolvers/Day");
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
  createDay: createDay,
  deleteFoodFromDay: deleteFoodFromDay,
  getFoods: getFoods,
  getRandomFood: getRandomFood
};
