const express = require("express");
const mongoose = require("mongoose");
const graphHttp = require("express-graphql");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const graphResolver = require("./graphql/RootResolver");
const graphSchema = require("./graphql/RootSchema");

const auth = require("./middleware/Authenticate");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@nodecluster-knux1.mongodb.net/${process.env.MONGO_DATABASE}`;

const app = express();
app.disable('x-powered-by');

app.use(helmet())
app.use(cors())

app.use(auth);

app.use(
  "/graphql",
  graphHttp({
    schema: graphSchema,
    rootValue: graphResolver,
    graphiql: process.env.NODE_ENV === "dev",
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      } else {
        const data = err.originalError;
        const message = err.message || "an error occured";
        const status = err.originalError.code || 500;
        return { message: message, code: status, data: data };
      }
    }
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    console.log("server is up!");
    app.listen(process.env.PORT || 3000);
  })
  .catch(error => console.log(error));
