const { buildSchema } = require("graphql");
const { mergeTypes } = require("merge-graphql-schemas");

const Food = require("./schemas/Food");
const User = require("./schemas/User");

const mergedTypes = mergeTypes([Food, User]);
module.exports = buildSchema(mergedTypes);
