import { Router } from "express";
import { jwtDecode } from "../middlewares/jwt.decode";
import { getRegisteredEventByUser, registerEvent } from "../controllers/registration.controller";

const registrationRouter = Router();

registrationRouter.post("/registration",jwtDecode, registerEvent);
registrationRouter.post("/my-registered-events",jwtDecode, getRegisteredEventByUser);


export default registrationRouter;