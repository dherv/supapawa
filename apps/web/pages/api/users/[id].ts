import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../lib/prisma";

export default async function getUser(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: 1 },
      include: { profile: true },
    });
    res.status(200).json(user);
  } catch (e) {
    console.error("Request error", e);
    res.status(500).json({ error: "Error fetching the user" });
  }
}
