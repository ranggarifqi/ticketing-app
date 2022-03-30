import { CustomError } from ".";
import { ErrorResponse } from "../responses/error";

export class DatabaseConnectionError extends Error implements CustomError {
  public statusCode: number = 500;

  private reason: string = "Error connecting to database";

  constructor() {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public getReason = () => {
    return this.reason;
  };

  public serializeError = (): ErrorResponse => {
    return {
      errors: [{ message: this.reason }],
    };
  };
}
