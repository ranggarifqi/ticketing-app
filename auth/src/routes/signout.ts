import express from "express";
import { UnauthorizedError } from "../commons/errors/unauthorized-error";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  if (!req.session?.jwt) {
    throw new UnauthorizedError("You're not signed in");
  }

  req.session = null;
  return res.status(204).send();
});

export { router as signoutRouter };
