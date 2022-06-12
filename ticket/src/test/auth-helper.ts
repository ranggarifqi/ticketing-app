import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../app";

interface UserJSON {
  id: string;
  email: string;
}

export const signIn = () => {
  // Build a JWT payload. { id, email }
  const payload: UserJSON = {
    id: "asdsada",
    email: "test@test.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  // Create a session object { jwt: ... }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionStr = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionStr).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`]; // so that supertest won't complain about it
};
