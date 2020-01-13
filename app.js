const express = require("express");
const mongoose = require("mongoose");
const graphHttp = require("express-graphql");
const bodyParser = require("body-parser");

const graphResolver = require("./graphql/resolver");
const graphSchema = require("./graphql/schema");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@nodecluster-knux1.mongodb.net/${process.env.MONGO_DATABASE}`;

const app = express();

app.use((req, res, next) => {
  //gotta better understand why im using this?!
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  "/graphql",
  graphHttp({
    schema: graphSchema,
    rootValue: graphResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      } else {
        const data = err.originalError.data;
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
