// use referral code
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

// attendee only
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


export const eventDisplayLists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;

    const displayEvents = await prisma.event.findMany({
      skip,
      take: limit,
      orderBy: { date: "asc" },
      select: {
        id: true,
        name: true,
        bannerUrl: true,
        city: true,
        venue: true,
        date: true,
        category: true,
        description: true,
        availableSeats: true,
      },
    });

    const totalEvents = await prisma.event.count();

    res.status(200).json({
      data: displayEvents,
      meta: {
        total: totalEvents,
        page,
        totalPages: Math.ceil(totalEvents / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
