import mongoose from "mongoose";

export const mongoObjectID = () => {
  return new mongoose.Types.ObjectId().toHexString();
};
