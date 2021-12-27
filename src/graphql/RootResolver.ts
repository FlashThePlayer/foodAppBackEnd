import { addFriend, createUser, getUser, loginUser } from "./resolvers/User";
import { getDays, patchDay } from "./resolvers/Day";
import {
  createFood,
  getFoods,
  getFood,
  deleteFood,
  getRandomFood,
  searchFood,
} from "./resolvers/Food";

const rootResolver = {
  createUser: createUser,
  loginUser: loginUser,
  createFood: createFood,
  getDays: getDays,
  patchDay: patchDay,
  getFoods: getFoods,
  getFood: getFood,
  deleteFood: deleteFood,
  getRandomFood: getRandomFood,
  searchFood: searchFood,
  getUser: getUser,
  addFriend: addFriend,
};

export default rootResolver;
