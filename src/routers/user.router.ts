import { Router } from "express";
import { jwtDecode } from "../middlewares/jwt.decode";
import { displayUserProfile, getUserById } from "../controllers/user.controller";
const userRouter = Router();

userRouter.get("/", jwtDecode, displayUserProfile);
userRouter.get("/:id", getUserById);

export default userRouter;