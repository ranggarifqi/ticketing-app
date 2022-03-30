import { CustomError } from ".";
import { ErrorResponse } from "../responses/error";

const REASON = "Error connecting to database";

export class DatabaseConnectionError extends CustomError {
  public statusCode: number = 500;

  private reason: string = REASON;

  constructor() {
    super(REASON);

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
