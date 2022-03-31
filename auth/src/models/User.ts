import { Schema, model, Model } from "mongoose";

interface IUser {
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  build(attrs: IUser): any;
}

const schema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

schema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};

export const User = model<IUser, UserModel>("User", schema);
