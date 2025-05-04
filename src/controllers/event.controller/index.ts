import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { AppError } from "../../utils/app.error";

// fetch all events for organizer
//done
export const getCreatedEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizerProfileId } = req.body.payload;

    const findOrganizerById = await prisma.organizerProfile.findFirst({
      where: {
        userId: organizerProfileId,
      },
    });

    if (findOrganizerById === null) {
      throw AppError("Organizer ID not found", 401);
    }

    const events = await prisma.event.findMany({
      where: {
        organizerProfileId: findOrganizerById.id,
      },
      include: {
        _count: {
          select: {
            reviews: true,
            registrations: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Displayed events successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};
