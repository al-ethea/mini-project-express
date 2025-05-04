import { Router } from "express";
import { jwtDecode } from "../middlewares/jwt.decode";
import {
  registerOrganizer,
  verifyEmailOrganizer,
} from "../controllers/organizer.controller";

const organizerRouter = Router();

organizerRouter.post("/register", jwtDecode, registerOrganizer);
organizerRouter.post("/verify-email", jwtDecode, verifyEmailOrganizer);

export default organizerRouter;
