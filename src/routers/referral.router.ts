import { applyReferral } from "../controllers/referral.controller";
import { jwtDecode } from "../middlewares/jwt.decode";
import { Router } from "express";

const referralRouter = Router();

referralRouter.post("/apply", jwtDecode, applyReferral);

export default referralRouter;
