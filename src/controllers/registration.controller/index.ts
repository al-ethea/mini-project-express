import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { AppError } from "../../utils/app.error";
import { jwtSign } from "../../utils/jwt.sign";

// attendee only
// blm selesai
export const registerEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get user referral if they hve
    // find event
    // 1. Apply 10% discount if they have a referral discount
    // 2. Apply points if user wants to
    // 3. Create Registration
    res.status(200).json({
      success: true,
      message: "Registered successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
