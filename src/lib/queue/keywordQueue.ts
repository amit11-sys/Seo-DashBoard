import { Queue } from "bullmq";
import { getRedis } from "../redis";

const connection = getRedis();

export const keywordQueue = new Queue("keywordQueue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: 1000,
    removeOnFail: 500,
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
  },
});
