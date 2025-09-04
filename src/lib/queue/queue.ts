import { Queue } from "bullmq";
import { getRedis } from "@/lib/redis";

export const keywordQueue = new Queue("keywordQueue", {
  connection: getRedis(),
});
