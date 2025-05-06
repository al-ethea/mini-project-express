import { Router } from "express";
import { jwtDecode } from "../middlewares/jwt.decode";
import {
  carouselEvents,
  eventRegistration,
  getCreatedEvents,
  getEventById,
} from "../controllers/event.controller";
import { createEvent } from "../controllers/event.controller";
import { eventDisplayLists } from "../controllers/event.controller";
import { verifiedOrganizerOnly } from "../middlewares/auth.guard/verifiedOrganizerOnly";

const eventRouter = Router();

eventRouter.get("/all-events", eventDisplayLists, carouselEvents);
eventRouter.post("/create-events", createEvent); //hrsnya ada jwt decode dan verified organizer only
eventRouter.get("/", jwtDecode, verifiedOrganizerOnly, getCreatedEvents);
eventRouter.get("/:id", getEventById);
eventRouter.post("/register-event", eventRegistration);

export default eventRouter;
