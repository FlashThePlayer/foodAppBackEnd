const { buildSchema } = require("graphql");
const { mergeTypes } = require("merge-graphql-schemas");

const Food = require("./schemas/Food");
const User = require("./schemas/User");
const Day = require("./schemas/Day");

const mergedTypes = mergeTypes([Food, User, Day]);
module.exports = buildSchema(mergedTypes);
