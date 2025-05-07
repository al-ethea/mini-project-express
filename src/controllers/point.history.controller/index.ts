// import { Request, Response } from "express";
// import { prisma } from "../../connection";

// export const createPointsHistory = async (req: Request, res: Response) => {
//   const { userId } = req.body.payload;
//   const { pointsUsed } = req.body;

//   if (!userId || pointsUsed == null) {
//     return res.status(400).json({ message: "userId dan pointsUsed wajib diisi." });
//   }

//   try {
//     const newHistory = await prisma.pointsHistory.create({
//       data: {
//         userId,
//         pointsUsed,
//       },
//     });

//     res.status(201).json({ message: "Points history created", data: newHistory });
//   } catch (error) {
//     console.error("Create points history error:", error);
//     res.status(500).json({ message: "Gagal membuat riwayat poin" });
//   }
// };
