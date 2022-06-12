import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  jwtAuth,
  UserJWTPayload,
  RequestWithCredential,
  validateRequest,
} from "@ranggarp-ticketing/common";

const router = express.Router();

router.post(
  "/api/tickets",
  jwtAuth,
  [
    body("title")
      .trim()
      .isAlphanumeric()
      .withMessage("Must be alphanumeric")
      .notEmpty()
      .withMessage("Cannot be empty"),
    body("price")
      .isFloat({
        min: 0,
      })
      .withMessage("Must be a float & greater or equal than 0")
      .notEmpty()
      .withMessage("Cannot be empty"),
  ],
  validateRequest,
  (req: RequestWithCredential, res: Response) => {
    res.status(200).send({});
  }
);

export { router as createTicketRouter };
