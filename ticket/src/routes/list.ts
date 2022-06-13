import {
  NotFoundError,
  RequestWithCredential,
} from "@ranggarp-ticketing/common";
import express, { Response } from "express";

import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get(
  "/api/tickets",
  async (req: RequestWithCredential, res: Response) => {
    const ticket = await Ticket.find();

    return res.status(200).send(ticket);
  }
);

export { router as listTicketRouter };
