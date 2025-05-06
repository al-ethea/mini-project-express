//event.controller

import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { AppError } from "../../utils/app.error";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import { cloudinaryUpload } from "../../utils/cloudinary.upload";

// fetch all events for organizer
// done
export const getCreatedEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.payload;
    // console.log("Organizer Profile ID:", userId);

    const findOrganizerById = await prisma.organizerProfile.findFirst({
      where: {
        userId: userId,
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

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.payload;
    const organizerProfile = await prisma.organizerProfile.findFirst({
      where: { userId: userId },
    });

    if (!organizerProfile) {
      throw AppError("Organizer profile not found", 404);
    }

    const {
      name,
      city,
      venue,
      date,
      category,
      price,
      description,
      availableSeats,
      type,
      artistId,
      // organizerProfileId,
    } = req.body;

    // Konversi dan validasi data
    const formattedDate = new Date(date); // cukup langsung new Date
    const parsedPrice = Number(price);
    const parsedAvailableSeats = Number(availableSeats);
    const parsedArtistId = Number(artistId);
    // const parsedOrganizerProfileId = Number(organizerProfileId);

    if (
      isNaN(parsedPrice) ||
      isNaN(parsedAvailableSeats) ||
      isNaN(parsedArtistId)
      // ||
      // isNaN(parsedOrganizerProfileId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid numeric input.",
      });
    }

    // ===== Cloudinary Image Upload =====

    const bannerUrl = [];
    let files: Express.Multer.File[] | undefined;
    if (req.files) {
      // ambil file yg di-upload dr multer
      files = Array.isArray(req.files) ? req.files : req.files["image"];

      // upload multiple files ke cloudinary
      for (const image of files) {
        // console.log(image);
        const result: any = await cloudinaryUpload(image.buffer);

        console.log(result);
        bannerUrl.push(result.res);
      }
    }
    console.log(bannerUrl);

    const newEvent = await prisma.event.create({
      data: {
        name,
        bannerUrl: bannerUrl[0],
        city,
        venue,
        date: formattedDate,
        category,
        price: parsedPrice,
        description,
        availableSeats: parsedAvailableSeats,
        type,
        artistId: parsedArtistId,
        organizerProfileId: organizerProfile.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Created event successfully.",
      data: newEvent,
    });
  } catch (error) {
    console.error("Create Event Error:", error); // penting
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

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid Event Id" });

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event)
      return res.status(404).json({ message: `Event with id ${id} not found` });

    res.status(200).json({
      success: true,
      message: `Event with id ${id} found`,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const eventRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      eventId,
      userId,
      quantity,
      usedPoints,
      tax,
      referralId,
      pointsHistoryId,
      discountUsed,
    } = req.body;

    if (!eventId || !userId || !quantity || !referralId || !pointsHistoryId) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const newRegistration = await prisma.registration.create({
      data: {
        eventId: Number(eventId),
        userId,
        quantity: Number(quantity),
        usedPoints: Number(usedPoints) || 0,
        tax: Number(tax) || 0,
        referralId: Number(referralId),
        pointsHistoryId: Number(pointsHistoryId),
        discountUsed: Boolean(discountUsed) || false,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: newRegistration,
    });
  } catch (error) {
    next(error);
  }
};

// controllers/event.controller.ts
export const carouselEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;

    // Contoh: Ambil event yang akan datang, bisa disesuaikan dengan kebutuhan
    const carouselEvents = await prisma.event.findMany({
      take: limit,
      where: {
        date: {
          gte: new Date(), // Hanya event yang tanggalnya belum lewat
        },
      },
      orderBy: { date: "asc" },
      select: {
        id: true,
        name: true,
        bannerUrl: true,
      },
    });

    res.status(200).json(carouselEvents);
  } catch (error) {
    next(error);
  }
};
