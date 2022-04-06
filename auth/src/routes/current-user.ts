import express from "express";
import { jwtAuth } from "../middlewares/jwt-auth";

const router = express.Router();

router.get("/api/users/currentuser", jwtAuth, (req, res) => {
  return res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };
