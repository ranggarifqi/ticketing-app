import bcyrpt from "bcrypt";

export class PasswordHasher {
  static salt: string | number = 11;

  static toHash = async (password: string) => {
    return await bcyrpt.hash(password, this.salt);
  };

  static compare = async (password: string, hashedPassword: string) => {
    return await bcyrpt.compare(password, hashedPassword);
  };
}
