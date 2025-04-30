import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { hashPassword } from "../../utils/hash.password";
import { comparePassword } from "../../utils/compare.password";
import { jwtSign } from "../../utils/jwt.sign";
import { generateReferralCode } from "../../utils/generate.referral.code";
import { AppError } from "../../utils/app.error";

// kalo mau olah data dari berbagai table, gunakan prisma.$transaction
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, postcode, password } = req.body;
    const findUserByEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (findUserByEmail !== null) {
      throw { isExpose: true, status: 401, message: "Email already exist" };
    }

    const hashedPassword = await hashPassword(password);

    let referralCode = generateReferralCode();
    let isUnique = false;
    while (!isUnique) {
      const existingReferral = await prisma.user.findUnique({
        where: { referralCode },
      });
      if (!existingReferral) {
        isUnique = true;
      } else {
        referralCode = generateReferralCode(); // regenerate if conflict
      }
    }
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        postcode,
        password: hashedPassword,
        role: "ATTENDEE",
        referralCode,
        totalPoints: 0,
      },
    });

    res.status(201).json({
      success: true,
      message: `User ${firstName} ${lastName} registered successfully`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const findUserByEmail = await prisma.user.findFirst({
      where: { email },
    });

    // console.log(findUserByEmail);

    if (findUserByEmail === null) {
      throw AppError("Email not found", 401);
    }

    const isPasswordMatch = await comparePassword(
      findUserByEmail?.password,
      password
    );

    if (isPasswordMatch === false) {
      throw AppError("Invalid password", 401);
    }

    const token = jwtSign({
      userId: findUserByEmail.id,
      userRole: findUserByEmail.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        token,
        email: findUserByEmail.email,
        role: findUserByEmail.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const sessionLoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payload } = req.body;

    const findUserByUserId = await prisma.user.findFirst({
      where: { id: payload.userId },
    });

    res.status(200).json({
      success: true,
      message: "Session login successfully",
      data: {
        token: req.headers.authorization?.split(" ")[1],
        email: findUserByUserId?.email,
        role: findUserByUserId?.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// done
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
      });
    });
    // console.log(result);

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
      where: { id: userId },
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
