import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
import helmet from "helmet";
import cors from "cors";

import graphResolver from "./graphql/RootResolver";
import graphSchema from "./graphql/RootSchema";
import authMiddleware from "./middleware/Authenticate";
import CustomError from "./types/CustomError";

const app = express();
app.disable("x-powered-by");

app.use(helmet());
app.use(cors());

app.use(authMiddleware);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphSchema,
    rootValue: graphResolver,
    graphiql: process.env.NODE_ENV === "dev",
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      } else {
        console.log(err);
        const data = err.originalError;
        const message = err.message || "an error occurred";
        const status = 500;
        return { message: message, code: status, data: data };
      }
    },
  })
);

app.use(
  (error: CustomError, _req: Request, res: Response, _next: NextFunction) => {
    console.log(error);
    const status = error.status || 500;
    const message = error.message;
    const data = error.data || "no data emitted in error";
    res.status(status).json({ message: message, data: data });
  }
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("server is up!");
    app.listen(process.env.PORT || 3000);
  })
  .catch((error) => console.log(error));
