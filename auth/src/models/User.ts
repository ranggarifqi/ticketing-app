import { Schema, model, Model, Document } from "mongoose";

interface IUser {
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  build(attrs: IUser): UserDoc;
}

interface UserDoc extends Document {
  email: string;
  password: string;
}

const schema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

schema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};

export const User = model<IUser, UserModel>("User", schema);
