const { createUser } = require("./resolvers/User");
const {
  createFood,
  getFood,
  getFoods,
  getRandomFood
} = require("./resolvers/Food");

module.exports = {
  createUser: createUser,
  createFood: createFood,
  getFood: getFood,
  getFoods: getFoods,
  getRandomFood: getRandomFood
};
