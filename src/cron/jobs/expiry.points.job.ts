import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const pointsExpiryJob = async () => {
  // Fetch records where points have expired or are set to expire (10000 each time)
  const expiredRecords = await prisma.pointsHistory.findMany({
    where: {
      pointsStatus: "ACTIVE",
      expirationDate: {
        lte: new Date(),
      },
    },
  });

  // Update user totalPoints by subtracting 10000 for each expired record
  await Promise.all(
    expiredRecords.map(async (record: any) => {
      // Deduct 10,000 points from the user's total points
      await prisma.user.update({
        where: { id: record.userId },
        data: {
          totalPoints: {
            decrement: 10000, // Decrease by 10,000 points
          },
        },
      });

      // Update the pointsHistory record to mark it as expired
      await prisma.pointsHistory.update({
        where: { id: record.id },
        data: {
          pointsStatus: "EXPIRED", // Mark as expired
        },
      });
    })
  );
};
