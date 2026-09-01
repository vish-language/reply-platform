import { Queue } from "bullmq";
import { redis } from "../../common/redis/redis.client.js";

export const aiReplyQueue = new Queue("ai-reply", {
  connection: redis,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: true,
    removeOnFail: false,
  },
});