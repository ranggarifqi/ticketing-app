import express from "express";
import { jwtAuth, RequestWithCredential } from "@ranggarp-ticketing/common";

const router = express.Router();

router.get("/api/users/currentuser", jwtAuth, (req: RequestWithCredential, res) => {
  return res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };
