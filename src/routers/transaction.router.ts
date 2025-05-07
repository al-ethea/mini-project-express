import { Router } from "express";
import { uploadPaymentReceipt } from "../controllers/transaction.controller";
import { jwtDecode } from "../middlewares/jwt.decode";
import { uploader } from "../middlewares/uploader.multer";

const transactionRouter = Router();

transactionRouter.post(
  "/upload-payment-receipt",
  uploader(["image/jpg", "image/jpeg", "image/png", "image/webp"]).fields([
    { name: "image", maxCount: 1 },
  ]),
  jwtDecode,
  uploadPaymentReceipt
);

export default transactionRouter;
