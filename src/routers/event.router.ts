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
import { uploader } from "../middlewares/uploader.multer";

const eventRouter = Router();

eventRouter.get("/all-events", eventDisplayLists, carouselEvents);
eventRouter.post(
  "/create-events",
  uploader(["image/jpg", "image/jpeg", "image/png", "image/webp"]).fields([
    { name: "image", maxCount: 1 },
  ]),
  jwtDecode,
  verifiedOrganizerOnly,
  createEvent
);
eventRouter.get("/", jwtDecode, verifiedOrganizerOnly, getCreatedEvents);
eventRouter.get("/:id", getEventById);
eventRouter.post("/:eventId/register", jwtDecode, eventRegistration);

export default eventRouter;
