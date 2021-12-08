import { Request } from "express";

export default interface ServerRequest extends Request {
  isAuth?: boolean;
  userId?: string;
}
