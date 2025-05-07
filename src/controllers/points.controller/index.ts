import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { AppError } from "../../utils/app.error";
import { addMonths } from "../../utils/calculate.expiration.date";

export const displayPointsHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.payload;

    // Validate user existence and fetch relevant data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        registrations: {
          include: {
            pointsHistory: true,
            event: {
              select: { name: true },
            },
          },
        },
        givenBy: {
          include: {
            pointsHistory: true,
            referredTo: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw AppError("User not found", 404);
    }

    // Points used during registration
    const usedPoints = user.registrations.flatMap((reg) => {
      if (!reg.pointsHistory) return [];
      return {
        type: "USED",
        amount: reg.pointsHistory.amount,
        expirationDate: addMonths(reg.createdAt, 3),
        eventName: reg.event.name,
        registrationId: reg.id,
        usedAt: reg.createdAt,
      };
    });

    // Points earned through referrals
    const earnedPoints = user.givenBy.flatMap((ref) => {
      if (!ref.pointsHistory) return [];
      return {
        type: "EARNED",
        amount: ref.pointsHistory.amount,
        expirationDate: addMonths(ref.createdAt, 3),
        referredUser: ref.referredTo,
        discountCode: ref.discountCode,
        earnedAt: ref.createdAt,
      };
    });

    // Combine and sort by expiration date (descending)
    const pointsHistory = [...earnedPoints, ...usedPoints].sort((a, b) => {
      const dateA = a.expirationDate ? new Date(a.expirationDate).getTime() : 0;
      const dateB = b.expirationDate ? new Date(b.expirationDate).getTime() : 0;
      return dateB - dateA;
    });

    res.status(200).json({
      success: true,
      message: "Points history displayed successfully",
      totalPoints: user.totalPoints,
      pointsHistory,
    });
  } catch (error) {
    console.error("Error in displayPointsHistory:", error);
    next(error);
  }
};
