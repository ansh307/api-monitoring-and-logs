// app/api/monitor/trigger/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { monitorQueue } from "@/lib/queues/monitorQueue";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await monitorQueue.add("manual-trigger", {}, { removeOnComplete: true });

  return NextResponse.json({ message: "Monitor job manually triggered!" });
}
