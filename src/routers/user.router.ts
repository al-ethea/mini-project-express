import { Router } from "express";
import { jwtDecode } from "../middlewares/jwt.decode";
import { displayUserProfile } from "../controllers/user.controller";
const userRouter = Router();

userRouter.get("/", jwtDecode, displayUserProfile);

export default userRouter;