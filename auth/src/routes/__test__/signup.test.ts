import request from "supertest";

import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test123",
    })
    .expect(201);
});

it("returns a 400 on invalid email", async () => {
  const response = await request(app).post("/api/users/signup").send({
    email: "test.com",
    password: "test123",
  });

  expect(response.status).toBe(400);
  expect(response.text).toBe(
    JSON.stringify({
      errors: [
        {
          message: "Must be a valid email",
          field: "email",
        },
      ],
    })
  );
});

describe("Test for failing password input", () => {
  it("returns a 400 if password length is < 4", async () => {
    const response = await request(app).post("/api/users/signup").send({
      email: "test@test.com",
      password: "t",
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      JSON.stringify({
        errors: [
          {
            message: "Password must be between 4 and 20 characters",
            field: "password",
          },
        ],
      })
    );
  });

  it("returns a 400 if password length is > 20", async () => {
    const response = await request(app).post("/api/users/signup").send({
      email: "test@test.com",
      password: "aaaaaaaaaaaaaaaaaaaaa",
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      JSON.stringify({
        errors: [
          {
            message: "Password must be between 4 and 20 characters",
            field: "password",
          },
        ],
      })
    );
  });
});
