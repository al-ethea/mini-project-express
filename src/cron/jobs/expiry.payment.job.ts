// expire logic: payment, discount code, points
// kl payment expired, ganti status jadi expired
// kl discount code expired, ganti status jadi expired dan delete
// kl points expired, ganti status jadi expired dan delete

import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const paymentExpiryJob = async () => {
  await prisma.transaction.updateMany({
    where: {
      paymentStatus: "WAITING_FOR_PAYMENT",
      expireAt: {
        lte: new Date(),
      },
    },
    data: {
      paymentStatus: "EXPIRED",
    },
  });
};
