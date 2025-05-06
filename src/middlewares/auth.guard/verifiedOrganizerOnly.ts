import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/app.error";

export const verifiedOrganizerOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userRole, verified } = req.body.payload;
    console.log(userRole);
    if (userRole !== "ORGANIZER") {
      throw AppError("You are unauthorized", 403);
    }
    if (verified === false) {
      throw AppError("You are not verified yet", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
