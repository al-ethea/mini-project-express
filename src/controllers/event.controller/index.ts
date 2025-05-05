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


export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid Event Id" });

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ message: `Event with id ${id} not found` });

    res.status(200).json({
      success: true,
      message: `Event with id ${id} found`,
      data: event,
    })
  } catch (error) {
    next(error);
  }
    
};