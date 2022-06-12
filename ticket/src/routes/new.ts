import {
  jwtAuth,
  UserJWTPayload,
  RequestWithCredential,
} from "@ranggarp-ticketing/common";
import express, { Request, Response } from "express";

const router = express.Router();

router.post(
  "/api/tickets",
  jwtAuth,
  (req: RequestWithCredential, res: Response) => {
    res.status(200).send({});
  }
);

export { router as createTicketRouter };
