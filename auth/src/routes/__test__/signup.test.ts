import request from "supertest";

import { app } from "../../app";
import { User } from "../../models/User";
import { ErrorResponse } from "../../commons/responses/error";

it("returns a 201 on successful signup", async () => {
  const response = await request(app).post("/api/users/signup").send({
    email: "test@test.com",
    password: "test123",
  });

  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();
  expect(response.body.email).toBe("test@test.com");
  expect(response.body.password).toBeUndefined();
});

it("returns a 400 on invalid email", async () => {
  const response = await request(app).post("/api/users/signup").send({
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

describe("Test for failing password input", () => {
  it("returns a 400 if password length is < 4", async () => {
    const response = await request(app).post("/api/users/signup").send({
      email: "test@test.com",
      password: "t",
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject<ErrorResponse>({
      errors: [
        {
          message: "Password must be between 4 and 20 characters",
          field: "password",
        },
      ],
    });
  });

  it("returns a 400 if password length is > 20", async () => {
    const response = await request(app).post("/api/users/signup").send({
      email: "test@test.com",
      password: "aaaaaaaaaaaaaaaaaaaaa",
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject<ErrorResponse>({
      errors: [
        {
          message: "Password must be between 4 and 20 characters",
          field: "password",
        },
      ],
    });
  });
});

it("returns a 400 if there's an existing email", async () => {
  const existingUser = User.build({
    email: "test@test.com",
    password: "test123",
  });
  await existingUser.save();

  const response = await request(app).post("/api/users/signup").send({
    email: "test@test.com",
    password: "test123",
  });

  expect(response.status).toBe(400);
  expect(response.body).toMatchObject<ErrorResponse>({
    errors: [
      {
        message: "User test@test.com already existed!",
      },
    ],
  });
});
