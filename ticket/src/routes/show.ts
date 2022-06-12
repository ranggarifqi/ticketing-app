import {
  NotFoundError,
  RequestWithCredential,
} from "@ranggarp-ticketing/common";
import express, { Response } from "express";

import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  async (req: RequestWithCredential, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError(`Ticket with id ${id} not found`);
    }

    return res.status(200).send(ticket);
  }
);

export { router as showTicketRouter };
