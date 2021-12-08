import { buildSchema } from "graphql";
import { mergeTypes } from "merge-graphql-schemas";
import Food from "./schemas/Food";
import User from "./schemas/User";
import Day from "./schemas/Day";

const mergedTypes = mergeTypes([Food, User, Day]);
export default buildSchema(mergedTypes);
