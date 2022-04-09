import express from "express";
import { jwtAuth } from "@ranggarp-ticketing/common";

const router = express.Router();

router.get("/api/users/currentuser", jwtAuth, (req, res) => {
  return res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };
