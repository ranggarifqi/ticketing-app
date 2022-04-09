import request from "supertest";
import { app } from "../../app";
import { ErrorResponse } from "../../commons/responses/error";
import { User, UserJWTPayload } from "../../models/User";

const seeds: any = {};

beforeEach(async () => {
  const existingUser = User.build({
    email: "test@test.com",
    password: "test123",
  });

  seeds.user = await existingUser.save();
});

it("returns a 401 when user is not signed in", async () => {
  const res = await request(app).get("/api/users/currentuser");

  expect(res.status).toBe(401);
  expect(res.body).toMatchObject<ErrorResponse>({
    errors: [
      {
        message: "Unauthorized",
      },
    ],
  });
});

it("returns a 200 when succesfully returns current user", async () => {
  const signInRes = await request(app).post("/api/users/signin").send({
    email: "test@test.com",
    password: "test123",
  });

  expect(signInRes.status).toBe(200);

  const cookies = signInRes.get("Set-Cookie");

  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookies);

  expect(res.status).toBe(200);
  const { currentUser } = res.body
  expect(currentUser.id).toBe(signInRes.body.id);
  expect(currentUser.email).toBe("test@test.com");
});
