// use referral code
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      bannerUrl,
      city,
      venue,
      date,
      category,
      price,
      description,
      availableSeats,
      type,
      artistId,
      organizerProfileId,
    } = req.body;

    // Konversi dan validasi data
    const formattedDate = new Date(date); // cukup langsung new Date
    const parsedPrice = Number(price);
    const parsedAvailableSeats = Number(availableSeats);
    const parsedArtistId = Number(artistId);
    const parsedOrganizerProfileId = Number(organizerProfileId);

    if (isNaN(parsedPrice) || isNaN(parsedAvailableSeats) || isNaN(parsedArtistId) || isNaN(parsedOrganizerProfileId)) {
      return res.status(400).json({
        success: false,
        message: "Input numerik tidak valid.",
      });
    }

    const newEvent = await prisma.event.create({
      data: {
        name,
        bannerUrl,
        city,
        venue,
        date: formattedDate,
        category,
        price: parsedPrice,
        description,
        availableSeats: parsedAvailableSeats,
        type,
        artistId: parsedArtistId,
        organizerProfileId: parsedOrganizerProfileId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Created successfully.",
      data: newEvent,
    });
  } catch (error) {
    console.error("Create Event Error:", error); // penting
    next(error);
  }
};
