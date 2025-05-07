import { Router } from "express";
import { jwtDecode } from "../middlewares/jwt.decode";
import {
  displayEventStatisticsBasedOnOrganizer,
  registerOrganizer,
  verifyEmailOrganizer,
} from "../controllers/organizer.controller";

const organizerRouter = Router();

organizerRouter.post("/register", jwtDecode, registerOrganizer);
organizerRouter.post("/verify-email", jwtDecode, verifyEmailOrganizer);
organizerRouter.get(
  "/display-event-stats",
  jwtDecode,
  displayEventStatisticsBasedOnOrganizer
);

export default organizerRouter;
