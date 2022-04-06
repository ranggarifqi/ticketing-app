import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { UnauthorizedError } from "../commons/errors/unauthorized-error";
import { ErrorResponse } from "../commons/responses/error";
import { UserJWTPayload } from "../models/User";

export const jwtAuth = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    throw new UnauthorizedError();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_SECRET!
    ) as UserJWTPayload;
    req.currentUser = payload;
  } catch (error) {
    throw new UnauthorizedError();
  }
  next();
};
