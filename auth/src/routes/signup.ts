import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../commons/errors/bad-request-error";
import { RequestValidationError } from "../commons/errors/request-validation-error";
import { User } from "../models/User";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Must be a valid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    console.log("Creating a user with credentials", { email, password });

    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      throw new BadRequestError(`User ${email} already existed!`);
    }

    const newUser = User.build({ email, password });
    await newUser.save();

    return res.status(201).send(newUser);
  }
);

export { router as signupRouter };
