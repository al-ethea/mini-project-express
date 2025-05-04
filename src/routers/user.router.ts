import { applyReferral} from "../controllers/user.controller";
import { jwtDecode } from "../middlewares/jwt.decode";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/apply-referral", jwtDecode, applyReferral);

export default userRouter;
