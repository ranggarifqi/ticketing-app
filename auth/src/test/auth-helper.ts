import request from "supertest";
import { app } from "../app";
import { User, UserJSON } from "../models/User";

export const signIn = async () => {
  const email = "test@test.com";
  const password = "test123";

  const existingUser = User.build({
    email: "test@test.com",
    password: "test123",
  });

  await existingUser.save();

  const res = await request(app).post("/api/users/signin").send({
    email,
    password,
  });
  expect(res.status).toBe(200);

  return {
    user: res.body as UserJSON,
    cookies: res.get("Set-Cookie"),
  };
};
