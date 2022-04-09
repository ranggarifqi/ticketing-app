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

it("returns a 201 on successful signin", async () => {
  const response = await request(app).post("/api/users/signin").send({
    email: "test@test.com",
    password: "test123",
  });

  expect(response.status).toBe(200);
  expect(response.body.id).toBe(seeds.user.id);
  expect(response.body.email).toBe(seeds.user.email);
  expect(response.body.password).toBeUndefined();

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("returns a 401 on incorrect email", async () => {
  const response = await request(app).post("/api/users/signin").send({
    email: "test1@test.com",
    password: "test123",
  });

  expect(response.status).toBe(401);
  expect(response.body).toMatchObject<ErrorResponse>({
    errors: [
      {
        message: "Invalid email or password",
      },
    ],
  });

  expect(response.get("Set-Cookie")).toBeUndefined();
});

it("returns a 401 on incorrect password", async () => {
  const response = await request(app).post("/api/users/signin").send({
    email: "test@test.com",
    password: "test1234",
  });

  expect(response.status).toBe(401);
  expect(response.body).toMatchObject<ErrorResponse>({
    errors: [
      {
        message: "Invalid email or password",
      },
    ],
  });

  expect(response.get("Set-Cookie")).toBeUndefined();
});

it("returns a 400 on invalid email", async () => {
  const response = await request(app).post("/api/users/signin").send({
    email: "test.com",
    password: "test123",
  });

  expect(response.status).toBe(400);
  expect(response.body).toMatchObject<ErrorResponse>({
    errors: [
      {
        message: "Must be a valid email",
        field: "email",
      },
    ],
  });
});

it("returns a 400 on invalid password", async () => {
  const response = await request(app).post("/api/users/signin").send({
    email: "test@test.com",
  });

  expect(response.status).toBe(400);
  expect(response.body).toMatchObject<ErrorResponse>({
    errors: [
      {
        message: "Password must be provided",
        field: "password",
      },
    ],
  });
});
