import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/app.error";
import { jwtSign } from "../../utils/jwt.sign";
import { prisma } from "../../connection";

// attendee only
// blm selesai
// export const registerEvent = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // get user referral if they hve
//     // find event
//     // 1. Apply 10% discount if they have a referral discount
//     // 2. Apply points if user wants to
//     // 3. Create Registration
//     res.status(200).json({
//       success: true,
//       message: "Registered successfully.",
//       data: null,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


export const registerEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, eventId, quantity, tax, discountCode, usedPoints } = req.body;

    let referral = null;
    let discountUsed = false;

    if (discountCode) {
      referral = await prisma.referral.findFirst({
        where: {
          discountCode,
          discountStatus: "ACTIVE",
          referredUserId: userId, // hanya user yang dirujuk yang bisa pakai kodenya
        },
      });

      if (!referral) {
        return res.status(400).json({
          success: false,
          message: "Kode diskon tidak valid.",
        });
      }

      discountUsed = true;
    }

    const pointsHistory = await prisma.pointsHistory.create({
      data: {
        amount: usedPoints,
        expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // expired 90 hari
      },
    });

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event tidak ditemukan.",
      });
    }

    let total = event.price * quantity;
    if (discountUsed) {
      total = total * 0.9; // potongan 10%
    }
    total += tax;

    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
        quantity,
        tax,
        usedPoints,
        discountUsed,
        referralId: referral?.id ?? 0, 
        pointsHistoryId: pointsHistory.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Registered successfully.",
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};


export const getRegisteredEventByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.payload;

    console.log(">>>");
    console.log(userId);

    const myRegistrations = await prisma.registration.findMany({
      where: {
        userId,
      },
      include: {
        user: true,   // join ke tabel user
        event: true,  // join ke tabel event
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "List of registered events fetched successfully.",
      data: myRegistrations,
    });
  } catch (error) {
    next(error);
  }
};
