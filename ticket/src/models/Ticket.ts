import { Model, Document, Schema, model } from "mongoose";

export interface ITicket {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends Model<ITicket> {
  build(attrs: ITicket): TicketDoc;
}

const schema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (doc, res) => {
        res.id = res._id;
        delete res.__v;
        delete res._id;
      },
    },
  }
);

schema.statics.build = (attrs: ITicket) => {
  return new Ticket(attrs);
};

const Ticket = model<ITicket, TicketModel>("Ticket", schema);

export { Ticket };
