const bycript = require("bcrypt");

const User = require("../../models/User");

exports.createUser = async function({ userInput }, req) {
  const hashedpass = await bycript.hash(userInput.password, 12);
  const user = new User({
    name: userInput.name,
    email: userInput.email,
    password: hashedpass
  });

  const dbUser = await user.save();
  if (!dbUser) {
    Error.throwError(404, "could not create user!");
  }

  return {
    ...dbUser._doc,
    _id: dbUser._id.toString()
  };
};
