import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { AppError } from "../../utils/app.error";

export const displayPointsHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.payload;

    // Get user to validate existence and fetch related point records
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
    // Points used during registration (decrease)
    const usedPoints = user.registrations
      .filter((reg) => reg.pointsHistory)
      .map((reg) => ({
        type: "USED",
        amount: reg.pointsHistory?.amount,
        expirationDate: reg.pointsHistory?.expirationDate,
        eventName: reg.event.name,
        registrationId: reg.id,
        usedAt: reg.createdAt,
      }));

    // Points earned from giving referrals (increase)
    const earnedPoints = user.givenBy
      .filter((ref) => ref.pointsHistory)
      .map((ref) => ({
        type: "EARNED",
        amount: ref.pointsHistory?.amount,
        expirationDate: ref.pointsHistory?.expirationDate,
        referredUser: ref.referredTo,
        discountCode: ref.discountCode,
        earnedAt: ref.createdAt,
      }));

    // Combine and sort chronologically
    const pointsHistory = [...earnedPoints, ...usedPoints].sort(
      (a, b) =>
        new Date(b.expirationDate).getTime() -
        new Date(a.expirationDate).getTime()
    );

    res.status(200).json({
      success: true,
      message: "Points history displayed successfully",
      totalPoints: user.totalPoints,
      pointsHistory,
    });
  } catch (error) {
    next(error);
  }
};
