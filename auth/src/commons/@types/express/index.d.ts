import { Request } from "express";
import { UserJWTPayload } from "../../../models/User";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserJWTPayload;
    }
  }
}
