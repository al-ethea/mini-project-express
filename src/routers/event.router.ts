import { Router } from "express";
import { jwtDecode } from "../middlewares/jwt.decode";
import { getCreatedEvents, getEventById } from "../controllers/event.controller";
import { createEvent } from "../controllers/event.controller";
import { eventDisplayLists } from "../controllers/event.controller";

const eventRouter = Router();

eventRouter.get("/all-events", eventDisplayLists);
eventRouter.post("/create-events", createEvent);
eventRouter.get("/", jwtDecode, getCreatedEvents);
eventRouter.get("/:id", getEventById);

export default eventRouter;