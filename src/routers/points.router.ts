import { Router } from "express";
import { jwtDecode } from "../middlewares/jwt.decode";
import { displayPointsHistory } from "../controllers/points.controller";

const pointsRouter = Router();

pointsRouter.get("/", jwtDecode, displayPointsHistory);

export default pointsRouter;
