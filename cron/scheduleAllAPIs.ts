// cron/scheduleAllAPIs.ts
import { prisma } from "@/lib/prisma";
import { monitorQueue } from "@/lib/queues/monitorQueue";

export async function scheduleMonitoringJobs() {
  const apis = await prisma.api.findMany();

  for (const api of apis) {
    await monitorQueue.add(
      "monitor-api",
      { apiId: api.id },
      {
        repeat: { pattern: "0 * * * *" }, // Every hour
        jobId: `monitor-${api.id}`,
      }
    );
  }
}
