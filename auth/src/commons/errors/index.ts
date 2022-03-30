import { ErrorResponse } from "../responses/error";

export interface CustomError {
  statusCode: number;
  serializeError(): ErrorResponse;
}
