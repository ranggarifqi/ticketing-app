import express, { Request, Response } from "express";
import { body, param } from "express-validator";

import {
  jwtAuth,
  NotFoundError,
  RequestWithCredential,
  validateRequest,
  ForbiddenError,
} from "@ranggarp-ticketing/common";
import { Ticket } from "../models/Ticket";

const router = express.Router();

interface UpdateTicketBody {
  title: string;
  price: number;
}
interface UpdateTicketReq extends RequestWithCredential {
  body: UpdateTicketBody;
}

router.put(
  "/api/tickets/:id",
  jwtAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Should be a Mongo ObjectID")
      .notEmpty()
      .withMessage("Should not be empty"),
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
  async (req: UpdateTicketReq, res: Response) => {
    const { id: userId } = req.currentUser!;
    const { id: ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError(`Ticket with id ${ticketId} not found`);
    }

    if (ticket.userId !== userId) {
      throw new ForbiddenError(`You're not authorized to update this ticket`);
    }

    const { title, price } = req.body;
    ticket.title = title;
    ticket.price = price;
    await ticket.save();

    return res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
