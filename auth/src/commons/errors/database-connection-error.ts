export class DatabaseConnectionError extends Error {
  private reason: string = "Error connecting to database";

  constructor() {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public getReason = () => {
    return this.reason;
  };
}
