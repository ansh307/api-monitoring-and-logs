// app/api/diff/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const diff = await prisma.apiDiff.findUnique({ where: { id: params.id } });

  if (!diff)
    return NextResponse.json({ error: "Diff not found" }, { status: 404 });

  return NextResponse.json(diff);
}
