import { ErrorResponse } from "@ranggarp-ticketing/common";
import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
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
      expected: any;
    }
    const testCases: TestCase[] = [
      {
        title: "asdf",
        price: -10,
        expected: {
          errors: [
            {
              message: "Must be a float & greater or equal than 0",
              field: "price",
            },
          ],
        },
      },
      {
        title: "asdf",
        price: "    ",
        expected: {
          errors: [
            {
              message: "Must be a float & greater or equal than 0",
              field: "price",
            },
          ],
        },
      },
      {
        title: "asdf",
        expected: {
          errors: [
            {
              message: "Must be a float & greater or equal than 0",
              field: "price",
            },
            {
              message: "Cannot be empty",
              field: "price",
            },
          ],
        },
      },
    ];

    testCases.forEach(({ expected, ...payload }) => {
      it(`price = ${payload.price}`, async () => {
        const response = await req.send(payload);
        expect(response.status).toEqual(400);

        expect(response.body).toMatchObject<ErrorResponse>(expected);
      });
    });
  });

  it("creates a ticket with valid inputs", async () => {
    const ticketsBefore = await Ticket.find({});
    expect(ticketsBefore).toHaveLength(0);

    const response = await req.send({ title: "Ticket 1", price: 10 });
    expect(response.status).toEqual(201);
    expect(response.body.title).toEqual("Ticket 1");
    expect(response.body.price).toEqual(10);
    expect(response.body.userId).toEqual("asdsada");

    const ticketsAfter = await Ticket.find({});
    expect(ticketsAfter).toHaveLength(1);
    expect(ticketsAfter[0].title).toEqual("Ticket 1")
    expect(ticketsAfter[0].price).toEqual(10)
    expect(ticketsAfter[0].userId).toEqual("asdsada")
  });
});
