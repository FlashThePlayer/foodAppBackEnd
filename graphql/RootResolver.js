const { createUser, loginUser } = require("./resolvers/User");
const {
  createFood,
  getFood,
  getFoods,
  getRandomFood
} = require("./resolvers/Food");

module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  createFood: createFood,
  getFood: getFood,
  getFoods: getFoods,
  getRandomFood: getRandomFood
};
