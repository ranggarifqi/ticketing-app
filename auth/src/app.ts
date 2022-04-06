import express from "express";
import "express-async-errors"; // This module will enable us to use `throw` keyword in an async route handler
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./commons/errors/not-found-error";

const app = express();

/** So that express is aware that incoming traffic is coming from ingress-nginx */
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Example case of throwing in an async handler. On default behaviour, we would need to use `next()`
app.all("*", async () => {
  throw new NotFoundError("Route not found");
});

app.use(errorHandler);

export { app };