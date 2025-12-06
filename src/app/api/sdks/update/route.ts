// src/app/api/sdks/update/route.ts

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { apiId, sdkLanguage, currentUsed, latest, releaseNotes } =
    await req.json();

  if (!apiId || !sdkLanguage || !latest) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const sdk = await prisma.sdkVersion.upsert({
    where: {
      apiId_sdkLanguage: {
        apiId,
        sdkLanguage,
      },
    },
    update: {
      currentUsed,
      latest,
      releaseNotes,
    },
    create: {
      apiId,
      sdkLanguage,
      currentUsed,
      latest,
      releaseNotes,
    },
  });

  return NextResponse.json({ message: "SDK info updated", sdk });
}
