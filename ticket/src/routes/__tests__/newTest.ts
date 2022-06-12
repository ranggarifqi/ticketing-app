import { ErrorResponse } from "@ranggarp-ticketing/common";
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

  it("returns a status other than 401 if the user is signed in", async () => {
    const cookie = signIn();
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });
});

describe("Test for authenticated users", () => {
  let req: request.Test;

  beforeEach(() => {
    const cookie = signIn();
    req = request(app).post("/api/tickets").set("Cookie", cookie);
  });

  describe("When invalid title is provided", () => {
    interface TestCase {
      title?: string;
      price: number;
    }
    const testCases: TestCase[] = [
      { title: "", price: 10 },
      { title: "      ", price: 10 },
      { price: 10 },
    ];

    testCases.forEach((testCase) => {
      it(`title = ${testCase.title}`, async () => {
        const response = await req.send(testCase);
        expect(response.status).toEqual(400);

        expect(response.body).toMatchObject<ErrorResponse>({
          errors: [
            {
              message: "Must be alphanumeric",
              field: "title",
            },
            {
              message: "Cannot be empty",
              field: "title",
            },
          ],
        });
      });
    });
  });

  describe("When invalid price is provided", () => {
    interface TestCase {
      title: string;
      price?: any;
    }
    const testCases: TestCase[] = [
      { title: "asdf", price: -10 },
      { title: "asdf", price: "asdf" },
      { title: "asdf" },
    ];

    testCases.forEach((testCase) => {
      it(`price = ${testCase.price}`, async () => {
        const response = await req.send(testCase);
        expect(response.status).toEqual(400);
      });
    });
  });

  // it("creates a ticket with valid inputs", async () => {});
});
