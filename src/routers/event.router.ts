import { Router } from "express";
import { jwtDecode } from "../middlewares/jwt.decode";
import { getCreatedEvents } from "../controllers/event.controller";

const eventRouter = Router();

eventRouter.get("/", jwtDecode, getCreatedEvents);

export default eventRouter;
