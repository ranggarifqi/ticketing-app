import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { RequestValidationError } from "../commons/errors/request-validation-error";
import { UnauthorizedError } from "../commons/errors/unauthorized-error";
import { PasswordHasher } from "../commons/PasswordHasher";
import { INVALID_EMAIL_MSG } from "../commons/validations/errorMessages";
import { validateRequest } from "../middlewares/request-validation";
import { User } from "../models/User";

const router = express.Router();

const LOGIN_FAILED_MSG = "Invalid email or password";

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage(INVALID_EMAIL_MSG),
    body("password").trim().notEmpty().withMessage("Password must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      throw new UnauthorizedError(LOGIN_FAILED_MSG);
    }

    const isValidPassword = await PasswordHasher.compare(
      password,
      foundUser.password
    );
    if (!isValidPassword) {
      throw new UnauthorizedError(LOGIN_FAILED_MSG);
    }

    const userJWT = jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.JWT_SECRET!
    );

    req.session = {
      jwt: userJWT,
    };

    return res.status(200).send(foundUser);
  }
);

export { router as signinRouter };
