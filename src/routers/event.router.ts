
import { Router } from "express";
import { jwtDecode } from "../middlewares/jwt.decode";
import { getCreatedEvents } from "../controllers/event.controller";
import { Router } from "express";
import { createEvent } from "../controllers/event.controller";
import { eventDisplayLists } from "../controllers/user.controller";

const eventRouter = Router();

eventRouter.get("/all-events", eventDisplayLists);
eventRouter.post("/create-events", createEvent);
eventRouter.get("/", jwtDecode, getCreatedEvents);


export default eventRouter;
