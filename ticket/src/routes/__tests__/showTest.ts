import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import { mongoObjectID } from "../../test/factories";

it("should returns a 404 if the ticket is not found", async () => {
  const id = mongoObjectID();

  const response = await request(app).get(`/api/tickets/${id}`).send();
  expect(response.status).toEqual(404);
});

it("should returns the ticket if the ticket is found", async () => {
  const ticketSeed = Ticket.build({
    title: "Ticket 1",
    price: 10,
    userId: "testuserid",
  });
  await ticketSeed.save();

  const response = await request(app)
    .get(`/api/tickets/${ticketSeed.id}`)
    .send();

  expect(response.status).toEqual(200);
  expect(response.body.id).toEqual(ticketSeed.id);
  expect(response.body.title).toEqual(ticketSeed.title);
  expect(response.body.price).toEqual(ticketSeed.price);
  expect(response.body.userId).toEqual(ticketSeed.userId);
});
