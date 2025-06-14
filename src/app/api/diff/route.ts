// app/api/diff/route.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { apiId, versionId, diffJson } = body;

  const api = await prisma.api.findFirst({ where: { id: apiId, userId } });
  if (!api)
    return NextResponse.json({ error: "API not found" }, { status: 404 });

  const diff = await prisma.apiDiff.create({
    data: { apiId, versionId, diffJson: JSON.stringify(diffJson) },
  });

  return NextResponse.json(diff);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const apiId = searchParams.get("apiId");

  if (!apiId)
    return NextResponse.json({ error: "Missing apiId" }, { status: 400 });

  const diffs = await prisma.apiDiff.findMany({
    where: { apiId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(diffs);
}
