import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../lib/prisma";

export default async function assetHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const stars = await prisma.record.findMany({
          where: { userId: 1 },
          include: { user: true },
        });
        res.status(200).json(stars);
      } catch (e) {
        console.error("Request error", e);
        res.status(500).json({ error: "Error fetching posts" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
