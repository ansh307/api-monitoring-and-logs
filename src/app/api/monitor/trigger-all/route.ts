// app/api/monitor/trigger-all/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { monitorQueue } from "@/lib/queues/monitorQueue";

export async function POST() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apis = await prisma.api.findMany({ where: { userId } });

  if (!apis.length)
    return NextResponse.json({ error: "No APIs to monitor" }, { status: 400 });

  for (const api of apis) {
    await monitorQueue.add(
      "monitor-single",
      { apiId: api.id },
      { removeOnComplete: true }
    );
  }

  return NextResponse.json({ message: "All APIs scheduled for monitoring!" });
}
