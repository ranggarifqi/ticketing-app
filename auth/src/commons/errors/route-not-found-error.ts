import { CustomError } from ".";
import { ErrorResponse } from "../responses/error";

export class RouteNotFoundError extends CustomError {
  public statusCode: number = 400;

  constructor() {
    super("Route not found");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RouteNotFoundError.prototype);
  }

  serializeError(): ErrorResponse {
    return {
      errors: [
        {
          message: "Route not found",
        },
      ],
    };
  }
}
