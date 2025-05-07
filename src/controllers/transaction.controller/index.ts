import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { AppError } from "../../utils/app.error";
import { cloudinaryUpload } from "../../utils/cloudinary.upload";

export const uploadPaymentReceipt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.payload;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        registrations: {
          where: { deletedAt: null }, // optional filter
          orderBy: { createdAt: "desc" }, // assuming you want the latest one
          take: 1,
          include: { transaction: true },
        },
      },
    });

    if (!user || user.registrations.length === 0) {
      throw AppError("User or registration not found", 404);
    }

    const registration = user.registrations[0];
    const transaction = registration.transaction;

    if (!transaction) {
      throw AppError("Transaction not found", 404);
    }

    const paymentReceiptUrl: string[] = [];
    let files: Express.Multer.File[] | undefined;

    if (req.files) {
      files = Array.isArray(req.files) ? req.files : req.files["image"];
      for (const image of files) {
        const result: any = await cloudinaryUpload(image.buffer);
        paymentReceiptUrl.push(result.res);
      }
    }

    // Update transaction with uploaded receipt URL (use first one if only one allowed)
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentReceiptUrl: paymentReceiptUrl[0], // assuming you only store one
      },
    });

    res.status(200).json({
      message: "Payment receipt uploaded successfully",
      url: paymentReceiptUrl[0],
    });
  } catch (error) {
    next(error);
  }
};
