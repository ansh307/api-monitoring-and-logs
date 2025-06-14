import createClient from "ioredis";

export const redis = new createClient({
  host: process.env.REDIS_HOST!,
  port: 17064, // Correct port for your Redis instance
  password: process.env.REDIS_PASSWORD!, // Password for Redis
  maxRetriesPerRequest: null, // ✅ THIS LINE IS REQUIRED
});

// redis
//   .connect()
//   .catch((err: any) => console.error("Error connecting to Redis:", err));
