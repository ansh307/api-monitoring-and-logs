import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, openApiUrl } = await req.json();

  if (!name || !openApiUrl) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.api.findFirst({
    where: { openApiUrl, userId },
  });

  if (existing) return NextResponse.json({ message: "Already added" });

  try {
    let user = await prisma.user.findUnique({ where: { id: userId } });

    console.log("USERID::", userId, "USER::", user);

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 400 });
    }

    const newApi = await prisma.api.create({
      data: {
        name,
        openApiUrl,
        userId,
      },
    });

    return NextResponse.json({ message: "API registered", api: newApi });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
