import { ErrorResponse } from "@ranggarp-ticketing/common";
import request from "supertest";

import { app } from "../../app";
import { Dict } from "../../commons/types";
import { Ticket } from "../../models/Ticket";
import { signIn } from "../../test/auth-helper";
import { mongoObjectID } from "../../test/factories";

it("should throw 401 if auth token is not provided", async () => {
  const objectId = mongoObjectID();
  const response = await request(app).put(`/api/tickets/${objectId}`).send({});

  expect(response.status).toEqual(401);
});

describe("when authenticated", () => {
  const USER_ID = "testuser";

  let cookie: string[];

  const seed: Dict<any> = {};

  beforeEach(async () => {
    cookie = signIn({
      id: USER_ID,
      email: "test@test.com",
    });

    const ticket = Ticket.build({
      userId: USER_ID,
      title: "Ticket 1",
      price: 10,
    });
    await ticket.save();

    seed.ticket = ticket;
  });

  it("should update ticket successfully", async () => {
    const response = await request(app)
      .put(`/api/tickets/${seed.ticket.id}`)
      .set("Cookie", cookie)
      .send({
        title: "Ticket 1 edit",
        price: 11,
      });

    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual("Ticket 1 edit");
    expect(response.body.price).toEqual(11);
    expect(response.body.userId).toEqual(USER_ID);

    const ticket = await Ticket.findById(seed.ticket.id);
    expect(ticket).toBeDefined();
    expect(ticket).not.toBeNull();
    expect(ticket?.title).toEqual("Ticket 1 edit");
    expect(ticket?.price).toEqual(11);
    expect(ticket?.userId).toEqual(USER_ID);
  });

  it("should throw 404 if ticket is not found", async () => {
    const objectID = mongoObjectID();

    const response = await request(app)
      .put(`/api/tickets/${objectID}`)
      .set("Cookie", cookie)
      .send({
        title: "Ticket 1 edit",
        price: 11,
      });

    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject<ErrorResponse>({
      errors: [
        {
          message: `Ticket with id ${objectID} not found`,
        },
      ],
    });
  });

  it("should throw 403 when attempting to update non-owned ticket", async () => {
    const cookie = signIn({
      id: "otheruserid",
      email: "otheruser@test.com",
    });
    const response = await request(app)
      .put(`/api/tickets/${seed.ticket.id}`)
      .set("Cookie", cookie)
      .send({
        title: "Ticket 1 edit",
        price: 11,
      });

    expect(response.status).toEqual(403);
    expect(response.body).toMatchObject<ErrorResponse>({
      errors: [
        {
          message: "You're not authorized to update this ticket",
        },
      ],
    });
  });

  describe("When using invalid payload, should return 400", () => {
    it("should returns a 400 if no mongo objectID provided", async () => {
      const response = await request(app)
        .put(`/api/tickets/randomstr`)
        .set("Cookie", cookie)
        .send({
          title: "Ticket 1 edit",
          price: 11,
        });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject<ErrorResponse>({
        errors: [
          {
            message: "Should be a Mongo ObjectID",
            field: "id",
          },
        ],
      });
    });

    describe("test for body", () => {
      let req: request.Test;

      beforeEach(() => {
        req = request(app)
          .put(`/api/tickets/${seed.ticket.id}`)
          .set("Cookie", cookie);
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
    });
  });
});
