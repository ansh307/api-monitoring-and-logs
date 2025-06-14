// scripts/test-enqueue.ts
import { Queue } from "bullmq";
import { redis } from "@/lib/redis"; // same ioredis client

const test = async () => {
  const monitorQueue = new Queue("api-monitor", { connection: redis });

  await monitorQueue.add("monitor-api", { test: "hello world" });

  console.log("🎯 Job enqueued!");
};

test();
