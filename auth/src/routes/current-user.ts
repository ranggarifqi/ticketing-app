import express from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../commons/errors/unauthorized-error";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  if (!req.session?.jwt) {
    throw new UnauthorizedError();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET!);
    return res.send({ currentUser: payload });
  } catch (error) {
    throw new UnauthorizedError();
  }
});

export { router as currentUserRouter };
