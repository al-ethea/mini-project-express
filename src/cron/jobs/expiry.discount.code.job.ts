import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const discountCodeExpiryJob = async () => {
  await prisma.referral.updateMany({
    where: {
      discountStatus: "ACTIVE",
      discountExpireAt: {
        lte: new Date(),
      },
    },
    data: {
      discountStatus: "EXPIRED",
      deletedAt: new Date(),
    },
  });
};
