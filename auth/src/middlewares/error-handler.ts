import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../commons/errors/database-connection-error";
import { RequestValidationError } from "../commons/errors/request-validation-error";
import { ErrorProps, ErrorResponse } from "../commons/responses/error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).send(err.serializeError());
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).send(err.serializeError());
  }

  return res.status(500).send({
    errors: [
      {
        message: "Internal server error",
      },
    ],
  });
};
