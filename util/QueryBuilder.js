const UtilError = require("../util/Error");
const ObjectId = require("mongoose").Types.ObjectId;

exports.build = (query, userId) => {
  if (!userId) {
    UtilError.throwError(500, "query without a UserId is NOT valid!");
  }

  let selectQuery = { creator: ObjectId(userId) };

  if (query) {
    if (query.name) {
      selectQuery = {
        ...selectQuery,
        name: { $regex: query.name, $options: "i" },
      };
    }
    if (query.favorite) {
      selectQuery = {
        ...selectQuery,
        favorite: query.favorite,
      };
    }
    if (query.rating) {
      selectQuery = {
        ...selectQuery,
        rating: query.rating,
      };
    }
    if (query.difficulty) {
      selectQuery = {
        ...selectQuery,
        difficulty: query.difficulty,
      };
    }
  }

  return selectQuery;
};
