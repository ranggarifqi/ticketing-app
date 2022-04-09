import request from "supertest";
import { app } from "../../app";
import { ErrorResponse } from "../../commons/responses/error";
import { User } from "../../models/User";

const seeds: any = {};

beforeEach(async () => {
  const existingUser = User.build({
    email: "test@test.com",
    password: "test123",
  });

  seeds.user = await existingUser.save();
});

it("returns a 204 on successful signout", async () => {
  const jwtStr = JSON.stringify({
    jwt: "asdsadasdasd",
  });
  const base64 = Buffer.from(jwtStr).toString("base64");

  const response = await request(app)
    .post("/api/users/signout")
    .set("Cookie", [`session=${base64}`]);

  expect(response.status).toBe(204);
  expect(response.get("Set-Cookie")[0]).toMatch("session=;");
});

it("returns a 401 if user is not signed in", async () => {
  const response = await request(app).post("/api/users/signout");

  expect(response.status).toBe(401);
  expect(response.body).toMatchObject<ErrorResponse>({
    errors: [
      {
        message: "You're not signed in",
      },
    ],
  });
});
