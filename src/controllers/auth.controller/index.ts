import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { hashPassword } from "../../utils/hash.password";
import { comparePassword } from "../../utils/compare.password";
import { jwtSign } from "../../utils/jwt.sign";
import { generateReferralCode } from "../../utils/generate.referral.code";
import { AppError } from "../../utils/app.error";
import { transporter } from "../../utils/transporter.mailer";
import fs from "fs";
import { compile } from "handlebars";

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
    const createdUser = await prisma.user.create({
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

    const welcomeEmailTemplate = fs.readFileSync(
      "./src/public/welcome-email.html",
      "utf8"
    );

    const token = jwtSign({
      userId: createdUser.id,
    });

    // is it possible to hve a link to automatically login to the app?
    let welcomeEmailTemplateCompiled: any = compile(welcomeEmailTemplate);
    welcomeEmailTemplateCompiled = welcomeEmailTemplateCompiled({
      firstName: firstName,
      lastName: lastName,
      referralCode: referralCode,
      loginUrl: `${process.env.LINK_VERIFY_EMAIL}/login`, //link login
    });

    await transporter.sendMail({
      to: email,
      subject: "Welcome to LiveNation",
      html: welcomeEmailTemplateCompiled,
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
