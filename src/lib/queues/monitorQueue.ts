import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export const monitorQueue = new Queue("api-monitor", { connection: redis });
