// use referral code
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import { AppError } from "../../utils/app.error";


export const displayUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.payload;

    const findUserById = await prisma.user.findFirst({
      where: { id: userId },
    });
    res.status(201).json({
      success: true,
      message: "Profile displayed successfully",
      data: findUserById,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ data: user });
};