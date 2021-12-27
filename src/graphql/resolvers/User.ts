import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import User from "../../models/User";
import ServerRequest from "../../types/ServerRequest";
import throwError from "../../util/Error";
import {
  AddFriendResolver,
  CreateUserResolver,
  GetUserResolver,
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

export const getUser = async function (
  { name }: GetUserResolver,
  req: ServerRequest
) {
  if (!req.isAuth) {
    throwError(401, "not authenticated!");
  }

  try {
    const currentUser = await User.findById(req.userId);

    if (currentUser !== null) {
      const users = await User.find({ name: { $regex: name, $options: "i" } });
      const cleanedUsers = users.filter((user) => user._id !== currentUser._id);
      return cleanedUsers.map((user) => {
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
        };
      });
    } else {
      throwError(500, "Something went horribly wrong, current user is null");
    }
  } catch (error: any) {
    throwError(error.code, error);
  }
};

export const addFriend = async function (
  { id }: AddFriendResolver,
  req: ServerRequest
) {
  if (!req.isAuth) {
    throwError(401, "not authenticated!");
  }
  try {
    const user = await User.findById(req.userId);
    const userToAdd = await User.findById(id);

    if (!user) {
      throwError(404, "user not found!");
    }

    if (!userToAdd) {
      throwError(404, "friend not found!");
    }

    if (user!.friends && Array.isArray(user!.friends)) {
      // @ts-ignore
      if(user!.friends.includes(id)) {
        return "user was already added";
      }
      user!.friends.push(userToAdd!._id);
    } else {
      user!.friends = [userToAdd!._id];
    }

    await user!.save()

    return "added!";
  } catch (error: any) {
    console.log(error);
    throwError(error.code, error);
  }
};
