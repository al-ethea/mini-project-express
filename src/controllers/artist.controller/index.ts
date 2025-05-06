import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { AppError } from "../../utils/app.error";

export const getAllArtists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artists = await prisma.artist.findMany({});

    res.status(200).json({
      success: true,
      message: "Fetched all artists successfully",
      data: artists,
    });
  } catch (error) {
    next(error);
  }
};
