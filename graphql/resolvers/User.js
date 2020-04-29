const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const UtilError = require("../../util/Error");

exports.createUser = async function({ userInput }, req) {
  const hashedpass = await bycript.hash(userInput.password, 12);

  const existingUser = await User.findOne({ email: userInput.email });

  if (existingUser) {
    UtilError.throwError(403, "Email already used!");
  }

  const user = new User({
    name: userInput.name,
    email: userInput.email,
    password: hashedpass
  });

  const dbUser = await user.save();
  if (!dbUser) {
    UtilError.throwError(404, "could not create user!");
  }

  return {
    ...dbUser._doc,
    _id: dbUser._id.toString()
  };
};

exports.loginUser = async function({ userInput }, req) {
  try {
    const email = userInput.email;
    const password = userInput.password;

    const user = await User.findOne({ email: email });

    if (!user) {
      UtilError.throwError(401, "Email or password wrong!");
    }

    const isEqual = await bycript.compare(password, user.password);

    if (!isEqual) {
      UtilError.throwError(401, "Email or password wrong!");
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.AUTH_TOKEN_SEC,
      { expiresIn: "1h" }
    );
    return token;
  } catch (error) {
    UtilError.throwError(500, "Something went wrong :(");
  }
};
