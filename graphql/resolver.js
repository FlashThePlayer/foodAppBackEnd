const { createFood, getFood, getRandomFood } = require("./resolvers/Food");
const { createUser } = require("./resolvers/User");

module.exports = {
  createUser: createUser,
  createFood: createFood,
  getFood: getFood,
  getRandomFood: getRandomFood
};
