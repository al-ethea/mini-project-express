import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { AppError } from "../../utils/app.error";
import { jwtSign } from "../../utils/jwt.sign";
import { transporter } from "../../utils/transporter.mailer";
import fs from "fs";
import { compile } from "handlebars";

// bikin link buat verify
export const registerOrganizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyName, address, phoneNumber } = req.body;
    const { userId } = req.body.payload;

    if (!userId) {
      throw AppError("User ID not found", 401);
    }

    // Check if already organizer
    const existingProfile = await prisma.organizerProfile.findFirst({
      where: { userId: userId },
    });

    console.log(existingProfile);

    if (existingProfile) {
      throw AppError("Organizer profile already exists", 400);
    }
    const result = await prisma.$transaction(async (tx: any) => {
      // Create organizer profile
      await tx.organizerProfile.create({
        data: {
          companyName,
          address,
          phoneNumber,
          userId,
        },
      });

      // Update user role to ORGANIZER immediately
      return await tx.user.update({
        where: { id: userId },
        data: {
          role: "ORGANIZER",
        },
        select: {
          id: true,
          email: true,
        },
      });
    });
    // console.log(result);

    const verifyEmailOrganizerTemplate = fs.readFileSync(
      "./src/public/verify-organizer-email.html",
      "utf8"
    );

    const token = jwtSign({
      userId: result.id,
    });

    let verifyEmailOrganizerTemplateCompiled: any = compile(
      verifyEmailOrganizerTemplate
    );
    verifyEmailOrganizerTemplateCompiled = verifyEmailOrganizerTemplateCompiled(
      {
        companyName: companyName,
        verifyEmailUrl: `${process.env.LINK_VERIFY_EMAIL}/verifyOrganizerEmail/${token}`,
      }
    );

    await transporter.sendMail({
      to: result.email,
      subject: "One Step Away From Becoming an Organizer",
      html: verifyEmailOrganizerTemplateCompiled,
    });

    res.status(201).json({
      success: true,
      message: "Organizer profile created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// buat organizer profile
export const verifyEmailOrganizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.payload;
    //hasil token yg sdh di-decode

    const findUserByUserId = await prisma.user.findFirst({
      where: { id: userId, role: "ORGANIZER" },
    });

    if (findUserByUserId === null) {
      throw AppError("User not found", 401);
    }

    // Update the user's isVerified field to true
    await prisma.organizerProfile.update({
      data: { verified: true },
      where: { userId },
    });

    // Use your jwtSign function to generate the updated token
    const updatedToken = jwtSign({
      userId: findUserByUserId.id,
      userRole: findUserByUserId.role,
    });

    res.status(200).json({
      success: true,
      message: "Organizer email verified successfully",
      token: updatedToken,
    });
  } catch (error) {
    next(error);
  }
};

export const displayEventStatisticsBasedOnOrganizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.payload; // Extract userId from the token payload
    const organizerStats = await prisma.organizerProfile.findUnique({
      where: {
        userId: userId, // Use the logged-in user ID from the token payload
      },
      include: {
        event: {
          select: {
            registrations: {
              select: {
                id: true, // Selecting registration ids to count them
                transaction: {
                  select: {
                    id: true, // Selecting transaction ids to count them
                    amountToBePaid: true, // To calculate total transaction amount
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!organizerStats) {
      throw AppError("Organizer not found", 404);
    }

    // Calculate total registrations, transactions, and total amount paid
    const totalRegistrations = organizerStats.event.reduce(
      (acc, event) => acc + event.registrations.length,
      0
    );

    const totalTransactions = organizerStats.event.reduce(
      (acc, event) =>
        acc +
        event.registrations.reduce(
          (sum, registration) => sum + (registration.transaction ? 1 : 0),
          0
        ),
      0
    );

    const totalAmountPaid = organizerStats.event.reduce(
      (acc, event) =>
        acc +
        event.registrations.reduce(
          (sum, registration) =>
            sum + (registration.transaction?.amountToBePaid || 0),
          0
        ),
      0
    );

    // console.log("Total Registrations:", totalRegistrations);
    // console.log("Total Transactions:", totalTransactions);
    // console.log("Total Amount Paid:", totalAmountPaid);

    res.status(200).json({
      success: true,
      message: "Event stats displayed successfully",
      totalRegistrations,
      totalTransactions,
      totalAmountPaid,
    });
  } catch (error) {
    next(error);
  }
};
