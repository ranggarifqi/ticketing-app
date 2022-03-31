import express from "express";
import "express-async-errors"; // This module will enable us to use `throw` keyword in an async route handler
import { json } from "body-parser";
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./commons/errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Example case of throwing in an async handler. On default behaviour, we would need to use `next()`
app.all("*", async () => {
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
};

start();
