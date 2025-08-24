import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
 // Adjust path as needed

export const GET = auth(async (req) => {
  // The authenticated user is available on req.user if using next-auth v4 middleware
  const userEmail = req.auth?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      email: true,
      name: true,
      creditBalance: true,
      image: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
});
