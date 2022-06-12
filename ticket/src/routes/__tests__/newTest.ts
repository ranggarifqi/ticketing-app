import request from "supertest";
import { app } from "../../app";
import { signIn } from "../../test/auth-helper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

describe("test for auth", () => {
  it("can only accessed if user is signed in", async () => {
    const response = await request(app).post("/api/tickets").send({});

    expect(response.status).toEqual(401);
  });

  it.only("returns a status other than 401 if the user is signed in", async () => {
    const cookie = signIn()
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });
});

it("returns an error if an invalid title is provided", async () => {});

it("returns an error if an invalid price is provided", async () => {});

it("creates a ticket with valid inputs", async () => {});
