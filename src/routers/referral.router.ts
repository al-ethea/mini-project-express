import { applyReferral, checkDiscountCodeController } from "../controllers/referral.controller";
import { jwtDecode } from "../middlewares/jwt.decode";
import { Router } from "express";

const referralRouter = Router();

referralRouter.post("/apply", jwtDecode, applyReferral);
referralRouter.post("/check-discount",jwtDecode, checkDiscountCodeController);

export default referralRouter;
