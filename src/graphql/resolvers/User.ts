import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import User from "../../models/User";
import ServerRequest from "../../types/ServerRequest";
import throwError from "../../util/Error";
import {
  CreateUserResolver,
  LoginUserResolver,
} from "../../types/resolver/UserResolver";

export const createUser = async function (
  { userInput }: CreateUserResolver,
  _req: ServerRequest
) {
  const hashedPass = await hash(userInput.password, 12);

  const existingUser = await User.findOne({ email: userInput.email });

  if (existingUser) {
    throwError(403, "Email already used!");
  }

  const user = new User({
    name: userInput.name,
    email: userInput.email,
    password: hashedPass,
  });

  const dbUser = await user.save();
  if (!dbUser) {
    throwError(404, "could not create user!");
  }

  return {
    ...dbUser,
    _id: dbUser._id.toString(),
  };
};

export const loginUser = async function (
  { userInput }: LoginUserResolver,
  _req: ServerRequest
) {
  try {
    const email = userInput.email;
    const password = userInput.password;

    const user = await User.findOne({ email: email });
    const isEqual = await compare(password, user?.password || "");

    if (user && isEqual) {
      return sign(
        { email: user.email, userId: user._id.toString() },
        process.env.AUTH_TOKEN_SEC,
        { expiresIn: "1h" }
      );
    } else {
      throwError(401, "Email or password wrong!");
    }
  } catch (error: any) {
    throwError(error.code, error.message);
  }
};
