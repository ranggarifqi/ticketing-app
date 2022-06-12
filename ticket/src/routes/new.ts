import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  jwtAuth,
  UserJWTPayload,
  RequestWithCredential,
  validateRequest,
} from "@ranggarp-ticketing/common";
import { Ticket } from "../models/Ticket";

const router = express.Router();

interface NewTicketBody {
  title: string;
  price: number;
}
interface NewTicketReq extends RequestWithCredential {
  body: NewTicketBody;
}

router.post(
  "/api/tickets",
  jwtAuth,
  [
    body("title").trim().notEmpty().withMessage("Cannot be empty"),
    body("price")
      .isFloat({
        min: 0,
      })
      .withMessage("Must be a float & greater or equal than 0")
      .notEmpty()
      .withMessage("Cannot be empty"),
  ],
  validateRequest,
  async (req: NewTicketReq, res: Response) => {
    const { title, price } = req.body;
    const newTicket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await newTicket.save();

    return res.status(201).send(newTicket);
  }
);

export { router as createTicketRouter };
