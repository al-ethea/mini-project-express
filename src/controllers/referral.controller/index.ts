import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { addMonths } from "../../utils/calculate.expiration.date";
import { generateDiscountCode } from "../../utils/generate.discount.code";
import { AppError } from "../../utils/app.error";

// kalo mau olah data dari berbagai table, gunakan prisma.$transaction
// kecuali yg READ, ga usah pake transaction

// done
export const applyReferral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { referralCode } = req.body;
    const { userId } = req.body.payload;

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        referredTo: true, // check if already referred
      },
    });

    if (!user) {
      throw AppError(`User with id ${userId} not found`, 404);
    }

    if (user.referredTo?.length > 0) {
      throw AppError("You already used a referral code.", 400);
    }

    const referrer = await prisma.user.findFirst({
      where: { referralCode },
    });

    if (!referrer) {
      throw AppError("Referral code not found", 400);
    }

    if (referrer.id === user.id) {
      throw AppError("You cannot use your own referral code.", 400);
    }

    prisma.$transaction(async (tx) => {
      // create PointsHistory for referrer
      const pointsHistory = await tx.pointsHistory.create({
        data: {
          amount: 10000,
          expirationDate: addMonths(new Date(), 3),
        },
      });

      await tx.referral.create({
        data: {
          discountCode: generateDiscountCode(),
          referralGiverUserId: referrer.id,
          referredUserId: user.id,
          pointsHistoryId: pointsHistory.id,
          discountExpireAt: addMonths(new Date(), 3),
        },
      });
      // update referrer totalPoints
      await tx.user.update({
        where: { id: referrer.id },
        data: {
          totalPoints: { increment: 10000 },
        },
      });
      res.status(200).json({
        success: true,
        message: "Referral code applied successfully.",
        data: null,
      });
    });
  } catch (error) {
    // console.log("CTCH");
    next(error);
  }
};
