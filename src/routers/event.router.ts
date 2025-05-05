import { createEvent, getEventById } from "../controllers/event.controller";
import { eventDisplayLists } from "../controllers/user.controller";
import { Router } from "express";

const eventRouter = Router();

eventRouter.get("/all-events", eventDisplayLists);
eventRouter.post("/create-events", createEvent);
eventRouter.get("/:id", getEventById);

export default eventRouter;
