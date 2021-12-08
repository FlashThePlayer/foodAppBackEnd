import { JwtPayload, verify } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import ServerRequest from "../types/ServerRequest";

const authMiddleware = (
  req: ServerRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];
  let decodedToken: JwtPayload | string;
  try {
    decodedToken = verify(token, process.env.AUTH_TOKEN_SEC);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (instanceOfJwtPayload(decodedToken)) {
    req.userId = decodedToken.userId;
    req.isAuth = true;
    return next();
  } else {
    req.isAuth = false;
    return next();
  }
};

const instanceOfJwtPayload = (object: any): object is JwtPayload => {
  return "userId" in object;
};

export default authMiddleware;
