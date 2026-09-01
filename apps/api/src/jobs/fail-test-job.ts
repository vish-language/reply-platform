import { aiReplyQueue } from "./queues/ai-reply.queue.js";

await aiReplyQueue.add(
  "generate-reply",
  {
    commentId: "cmsobdfof0000mci9zmwehc",
  },
);

console.log("Fail test job added");

process.exit(0);