import request from "supertest";
import { app } from "../app";

interface UserJSON {
  id: string;
  email: string;
}

export const signIn = async () => {
  const email = "test@test.com";
  const password = "test123";

  const res = await request(app).post("/api/users/signup").send({
    email,
    password,
  });
  expect(res.status).toBe(200);

  return {
    user: res.body as UserJSON,
    cookies: res.get("Set-Cookie"),
  };
};
