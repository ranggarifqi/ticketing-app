import request from "supertest";

import { app } from "../../app";
import { ITicket, Ticket } from "../../models/Ticket";

const seedTickets = async () => {
  const bulkCreateTicketPayload = [1, 2].map<ITicket>((v) => {
    return {
      price: 10 + v,
      title: `Ticket ${v}`,
      userId: `userid${v}`,
    };
  });

  await Ticket.insertMany(bulkCreateTicketPayload);
};

it("should returns list of tickets", async () => {
  await seedTickets();

  const response = await request(app).get(`/api/tickets`).send();

  expect(response.status).toEqual(200);
  expect(response.body.length).toEqual(2);
});
