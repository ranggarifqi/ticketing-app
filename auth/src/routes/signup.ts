import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../commons/errors/bad-request-error";
import { INVALID_EMAIL_MSG } from "../commons/validations/errorMessages";
import { validateRequest } from "../middlewares/request-validation";
import { User, UserJWTPayload } from "../models/User";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage(INVALID_EMAIL_MSG),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      throw new BadRequestError(`User ${email} already existed!`);
    }

    const newUser = User.build({ email, password });
    await newUser.save();

    /** Generate JWT */
    const jwtPayload: UserJWTPayload = {
      id: newUser.id,
      email: newUser.email,
    };
    const userJWT = jwt.sign(jwtPayload, process.env.JWT_SECRET!);

    /** Store it on session object */
    req.session = {
      jwt: userJWT,
    };

    return res.status(201).send(newUser);
  }
);

export { router as signupRouter };
