import { Schema, model, Model, Document } from "mongoose";
import { PasswordHasher } from "../commons/PasswordHasher";

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

const schema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (doc, res) => {
        res.id = res._id;
        delete res.password;
        delete res.__v;
        delete res._id;
      },
    },
  }
);

schema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await PasswordHasher.toHash(this.get("password"));
    this.set("password", hashedPassword);
  }
  next();
});

export const User = model<IUser, UserModel>("User", schema);
